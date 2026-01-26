import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { User, Task, Submission, WalletTransaction, Notification, PeerHelpRequest, ChatMessage, DailyMultiplier } from '../entities/user.entity';
import { CreateUserDto, LoginDto, TaskDto, SubmissionDto, WalletTransactionDto, NotificationDto, PeerHelpRequestDto, ChatMessageDto, UpdateUserDto, UpdateTaskDto, UpdateSubmissionDto, UpdateNotificationDto, UpdatePeerHelpRequestDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new User();
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.name = createUserDto.name;
    
    return await this.userRepository.save(user);
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async getLeaderboard(): Promise<any[]> {
    // This would return top users based on tasks completed or earnings
    // For now, returning a mock response
    return [
      { rank: 1, name: 'John Doe', tier: 'Management', score: 1500 },
      { rank: 2, name: 'Jane Smith', tier: 'Lead', score: 1200 },
      { rank: 3, name: 'Bob Johnson', tier: 'Intern', score: 900 },
    ];
  }
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(status?: string): Promise<Task[]> {
    const whereCondition: any = {};
    if (status) {
      whereCondition.status = status;
    }
    return await this.taskRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async create(taskDto: TaskDto, creatorId: string): Promise<Task> {
    const task = new Task();
    Object.assign(task, taskDto);
    task.createdBy = { id: creatorId } as User;
    return await this.taskRepository.save(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async getHotTasks(limit = 5): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { status: 'OPEN' as any }, // Using 'as any' temporarily until we fix the enum mapping
      order: { reward: 'DESC' },
      take: limit,
    });
  }
}

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  async findOne(id: string): Promise<Submission> {
    return await this.submissionRepository.findOne({ where: { id } });
  }

  async findByUser(userId: string): Promise<Submission[]> {
    return await this.submissionRepository.find({ where: { userId } });
  }

  async create(submissionDto: SubmissionDto, userId: string): Promise<Submission> {
    const submission = new Submission();
    Object.assign(submission, submissionDto);
    submission.userId = userId;
    submission.submittedAt = new Date();
    submission.status = 'pending' as any; // Using 'as any' temporarily until we fix the enum mapping
    
    return await this.submissionRepository.save(submission);
  }

  async update(id: string, updateSubmissionDto: UpdateSubmissionDto): Promise<Submission> {
    const submission = await this.submissionRepository.findOne({ where: { id } });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    Object.assign(submission, updateSubmissionDto);
    submission.reviewedAt = new Date();
    return await this.submissionRepository.save(submission);
  }
}

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
  ) {}

  async getBalance(userId: string): Promise<number> {
    const lastTransaction = await this.walletTransactionRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    
    if (lastTransaction) {
      return lastTransaction.balanceAfter;
    }
    return 0;
  }

  async getTransactions(userId: string): Promise<WalletTransaction[]> {
    return await this.walletTransactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createTransaction(transactionDto: WalletTransactionDto): Promise<WalletTransaction> {
    const lastBalance = await this.getBalance(transactionDto.userId);
    let newBalance: number;
    
    if (transactionDto.transactionType === 'credit') {
      newBalance = lastBalance + transactionDto.amount;
    } else {
      newBalance = lastBalance - transactionDto.amount;
    }
    
    const transaction = new WalletTransaction();
    Object.assign(transaction, transactionDto);
    transaction.balanceAfter = newBalance;
    
    return await this.walletTransactionRepository.save(transaction);
  }
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findByUser(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(notificationDto: NotificationDto): Promise<Notification> {
    const notification = new Notification();
    Object.assign(notification, notificationDto);
    return await this.notificationRepository.save(notification);
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }
}

@Injectable()
export class PeerHelpService {
  constructor(
    @InjectRepository(PeerHelpRequest)
    private peerHelpRequestRepository: Repository<PeerHelpRequest>,
  ) {}

  async findAll(): Promise<PeerHelpRequest[]> {
    return await this.peerHelpRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<PeerHelpRequest[]> {
    return await this.peerHelpRequestRepository.find({ where: { userId } });
  }

  async create(requestDto: PeerHelpRequestDto, userId: string): Promise<PeerHelpRequest> {
    const request = new PeerHelpRequest();
    Object.assign(request, requestDto);
    request.userId = userId;
    request.status = 'open' as any; // Using 'as any' temporarily until we fix the enum mapping
    
    return await this.peerHelpRequestRepository.save(request);
  }

  async update(id: string, updateRequestDto: UpdatePeerHelpRequestDto): Promise<PeerHelpRequest> {
    const request = await this.peerHelpRequestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Peer help request not found');
    }

    Object.assign(request, updateRequestDto);
    return await this.peerHelpRequestRepository.save(request);
  }
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async getChatHistory(senderId: string, receiverId: string): Promise<ChatMessage[]> {
    return await this.chatMessageRepository.find({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(messageDto: ChatMessageDto, senderId: string): Promise<ChatMessage> {
    const message = new ChatMessage();
    message.senderId = senderId;
    message.receiverId = messageDto.receiverId;
    message.message = messageDto.message;
    message.messageType = (messageDto.messageType || 'text') as any; // Using 'as any' temporarily until we fix the enum mapping
    
    return await this.chatMessageRepository.save(message);
  }
}

@Injectable()
export class DashboardService {
  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private submissionService: SubmissionService,
  ) {}

  async getDashboardData(userId: string): Promise<any> {
    const user = await this.userService.findOneById(userId);
    const hotTasks = await this.taskService.getHotTasks();
    const submissions = await this.submissionService.findByUser(userId);
    const tasks = await this.taskService.findAll();

    // Mock recent activity data
    const recentActivity = [
      {
        type: 'task_completed',
        title: 'Fixed API endpoint bug',
        description: 'Successfully completed the task and earned 50 WTH',
        reward: 50,
        timestamp: new Date().toISOString(),
      },
      {
        type: 'time_remaining',
        title: 'Daily streak bonus available',
        description: 'Complete a task today to maintain your 5-day streak',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        type: 'info',
        title: 'New task available',
        description: 'New \'Advanced React Patterns\' task added to the queue',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      },
    ];

    return {
      user,
      hotTasks,
      recentActivity,
      submissions,
      tasks,
    };
  }
}