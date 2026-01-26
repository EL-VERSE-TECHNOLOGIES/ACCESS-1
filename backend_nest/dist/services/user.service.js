"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = exports.ChatService = exports.PeerHelpService = exports.NotificationService = exports.WalletService = exports.SubmissionService = exports.TaskService = exports.UserService = exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            token_type: 'bearer',
        };
    }
    async register(createUserDto) {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = new user_entity_1.User();
        user.email = createUserDto.email;
        user.password = hashedPassword;
        user.name = createUserDto.name;
        return await this.userRepository.save(user);
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findOneById(id) {
        return await this.userRepository.findOne({ where: { id } });
    }
    async updateProfile(id, updateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }
    async getLeaderboard() {
        return [
            { rank: 1, name: 'John Doe', tier: 'Management', score: 1500 },
            { rank: 2, name: 'Jane Smith', tier: 'Lead', score: 1200 },
            { rank: 3, name: 'Bob Johnson', tier: 'Intern', score: 900 },
        ];
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
let TaskService = class TaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async findAll(status) {
        const whereCondition = {};
        if (status) {
            whereCondition.status = status;
        }
        return await this.taskRepository.find({
            where: whereCondition,
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return await this.taskRepository.findOne({ where: { id } });
    }
    async create(taskDto, creatorId) {
        const task = new user_entity_1.Task();
        Object.assign(task, taskDto);
        task.createdBy = { id: creatorId };
        return await this.taskRepository.save(task);
    }
    async update(id, updateTaskDto) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        Object.assign(task, updateTaskDto);
        return await this.taskRepository.save(task);
    }
    async getHotTasks(limit = 5) {
        return await this.taskRepository.find({
            where: { status: 'OPEN' },
            order: { reward: 'DESC' },
            take: limit,
        });
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskService);
let SubmissionService = class SubmissionService {
    constructor(submissionRepository) {
        this.submissionRepository = submissionRepository;
    }
    async findOne(id) {
        return await this.submissionRepository.findOne({ where: { id } });
    }
    async findByUser(userId) {
        return await this.submissionRepository.find({ where: { userId } });
    }
    async create(submissionDto, userId) {
        const submission = new user_entity_1.Submission();
        Object.assign(submission, submissionDto);
        submission.userId = userId;
        submission.submittedAt = new Date();
        submission.status = 'pending';
        return await this.submissionRepository.save(submission);
    }
    async update(id, updateSubmissionDto) {
        const submission = await this.submissionRepository.findOne({ where: { id } });
        if (!submission) {
            throw new common_1.NotFoundException('Submission not found');
        }
        Object.assign(submission, updateSubmissionDto);
        submission.reviewedAt = new Date();
        return await this.submissionRepository.save(submission);
    }
};
exports.SubmissionService = SubmissionService;
exports.SubmissionService = SubmissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Submission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubmissionService);
let WalletService = class WalletService {
    constructor(walletTransactionRepository) {
        this.walletTransactionRepository = walletTransactionRepository;
    }
    async getBalance(userId) {
        const lastTransaction = await this.walletTransactionRepository.findOne({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        if (lastTransaction) {
            return lastTransaction.balanceAfter;
        }
        return 0;
    }
    async getTransactions(userId) {
        return await this.walletTransactionRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async createTransaction(transactionDto) {
        const lastBalance = await this.getBalance(transactionDto.userId);
        let newBalance;
        if (transactionDto.transactionType === 'credit') {
            newBalance = lastBalance + transactionDto.amount;
        }
        else {
            newBalance = lastBalance - transactionDto.amount;
        }
        const transaction = new user_entity_1.WalletTransaction();
        Object.assign(transaction, transactionDto);
        transaction.balanceAfter = newBalance;
        return await this.walletTransactionRepository.save(transaction);
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.WalletTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WalletService);
let NotificationService = class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async findByUser(userId) {
        return await this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async create(notificationDto) {
        const notification = new user_entity_1.Notification();
        Object.assign(notification, notificationDto);
        return await this.notificationRepository.save(notification);
    }
    async update(id, updateNotificationDto) {
        const notification = await this.notificationRepository.findOne({ where: { id } });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        Object.assign(notification, updateNotificationDto);
        return await this.notificationRepository.save(notification);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationService);
let PeerHelpService = class PeerHelpService {
    constructor(peerHelpRequestRepository) {
        this.peerHelpRequestRepository = peerHelpRequestRepository;
    }
    async findAll() {
        return await this.peerHelpRequestRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findByUser(userId) {
        return await this.peerHelpRequestRepository.find({ where: { userId } });
    }
    async create(requestDto, userId) {
        const request = new user_entity_1.PeerHelpRequest();
        Object.assign(request, requestDto);
        request.userId = userId;
        request.status = 'open';
        return await this.peerHelpRequestRepository.save(request);
    }
    async update(id, updateRequestDto) {
        const request = await this.peerHelpRequestRepository.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException('Peer help request not found');
        }
        Object.assign(request, updateRequestDto);
        return await this.peerHelpRequestRepository.save(request);
    }
};
exports.PeerHelpService = PeerHelpService;
exports.PeerHelpService = PeerHelpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.PeerHelpRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PeerHelpService);
let ChatService = class ChatService {
    constructor(chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }
    async getChatHistory(senderId, receiverId) {
        return await this.chatMessageRepository.find({
            where: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ],
            order: { createdAt: 'ASC' },
        });
    }
    async sendMessage(messageDto, senderId) {
        const message = new user_entity_1.ChatMessage();
        message.senderId = senderId;
        message.receiverId = messageDto.receiverId;
        message.message = messageDto.message;
        message.messageType = (messageDto.messageType || 'text');
        return await this.chatMessageRepository.save(message);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.ChatMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatService);
let DashboardService = class DashboardService {
    constructor(userService, taskService, submissionService) {
        this.userService = userService;
        this.taskService = taskService;
        this.submissionService = submissionService;
    }
    async getDashboardData(userId) {
        const user = await this.userService.findOneById(userId);
        const hotTasks = await this.taskService.getHotTasks();
        const submissions = await this.submissionService.findByUser(userId);
        const tasks = await this.taskService.findAll();
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
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
                type: 'info',
                title: 'New task available',
                description: 'New \'Advanced React Patterns\' task added to the queue',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UserService,
        TaskService,
        SubmissionService])
], DashboardService);
//# sourceMappingURL=user.service.js.map