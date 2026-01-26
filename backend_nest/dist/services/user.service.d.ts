import { Repository } from 'typeorm';
import { User, Task, Submission, WalletTransaction, Notification, PeerHelpRequest, ChatMessage } from '../entities/user.entity';
import { CreateUserDto, LoginDto, TaskDto, SubmissionDto, WalletTransactionDto, NotificationDto, PeerHelpRequestDto, ChatMessageDto, UpdateUserDto, UpdateTaskDto, UpdateSubmissionDto, UpdateNotificationDto, UpdatePeerHelpRequestDto } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        token_type: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<User>;
    getProfile(userId: string): Promise<User>;
}
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findOneById(id: string): Promise<User>;
    updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    getLeaderboard(): Promise<any[]>;
}
export declare class TaskService {
    private taskRepository;
    constructor(taskRepository: Repository<Task>);
    findAll(status?: string): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    create(taskDto: TaskDto, creatorId: string): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    getHotTasks(limit?: number): Promise<Task[]>;
}
export declare class SubmissionService {
    private submissionRepository;
    constructor(submissionRepository: Repository<Submission>);
    findOne(id: string): Promise<Submission>;
    findByUser(userId: string): Promise<Submission[]>;
    create(submissionDto: SubmissionDto, userId: string): Promise<Submission>;
    update(id: string, updateSubmissionDto: UpdateSubmissionDto): Promise<Submission>;
}
export declare class WalletService {
    private walletTransactionRepository;
    constructor(walletTransactionRepository: Repository<WalletTransaction>);
    getBalance(userId: string): Promise<number>;
    getTransactions(userId: string): Promise<WalletTransaction[]>;
    createTransaction(transactionDto: WalletTransactionDto): Promise<WalletTransaction>;
}
export declare class NotificationService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    findByUser(userId: string): Promise<Notification[]>;
    create(notificationDto: NotificationDto): Promise<Notification>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
}
export declare class PeerHelpService {
    private peerHelpRequestRepository;
    constructor(peerHelpRequestRepository: Repository<PeerHelpRequest>);
    findAll(): Promise<PeerHelpRequest[]>;
    findByUser(userId: string): Promise<PeerHelpRequest[]>;
    create(requestDto: PeerHelpRequestDto, userId: string): Promise<PeerHelpRequest>;
    update(id: string, updateRequestDto: UpdatePeerHelpRequestDto): Promise<PeerHelpRequest>;
}
export declare class ChatService {
    private chatMessageRepository;
    constructor(chatMessageRepository: Repository<ChatMessage>);
    getChatHistory(senderId: string, receiverId: string): Promise<ChatMessage[]>;
    sendMessage(messageDto: ChatMessageDto, senderId: string): Promise<ChatMessage>;
}
export declare class DashboardService {
    private userService;
    private taskService;
    private submissionService;
    constructor(userService: UserService, taskService: TaskService, submissionService: SubmissionService);
    getDashboardData(userId: string): Promise<any>;
}
