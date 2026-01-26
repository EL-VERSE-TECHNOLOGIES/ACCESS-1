import { AuthService } from '../services/user.service';
import { UserService, TaskService, SubmissionService, WalletService, NotificationService, PeerHelpService, ChatService, DashboardService } from '../services/user.service';
import { CreateUserDto, LoginDto, TaskDto, UpdateTaskDto, SubmissionDto, UpdateUserDto, PeerHelpRequestDto, ChatMessageDto } from '../dto/user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        token_type: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<import("../entities/user.entity").User>;
    getProfile(req: any): Promise<import("../entities/user.entity").User>;
}
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<import("../entities/user.entity").User>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<import("../entities/user.entity").User>;
    getLeaderboard(): Promise<any[]>;
}
export declare class TaskController {
    private taskService;
    private submissionService;
    constructor(taskService: TaskService, submissionService: SubmissionService);
    getTasks(status?: string): Promise<import("../entities/user.entity").Task[]>;
    getTask(id: string): Promise<import("../entities/user.entity").Task>;
    createTask(req: any, taskDto: TaskDto): Promise<import("../entities/user.entity").Task>;
    updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<import("../entities/user.entity").Task>;
    getHotTasks(): Promise<import("../entities/user.entity").Task[]>;
    submitTask(taskId: string, req: any, submissionDto: SubmissionDto): Promise<import("../entities/user.entity").Submission>;
}
export declare class SubmissionController {
    private submissionService;
    constructor(submissionService: SubmissionService);
    getUserSubmissions(req: any): Promise<import("../entities/user.entity").Submission[]>;
}
export declare class WalletController {
    private walletService;
    constructor(walletService: WalletService);
    getBalance(req: any): Promise<{
        balance: number;
    }>;
    getTransactions(req: any): Promise<import("../entities/user.entity").WalletTransaction[]>;
}
export declare class NotificationController {
    private notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(req: any): Promise<import("../entities/user.entity").Notification[]>;
}
export declare class PeerHelpController {
    private peerHelpService;
    private chatService;
    constructor(peerHelpService: PeerHelpService, chatService: ChatService);
    getPeerHelpRequests(): Promise<import("../entities/user.entity").PeerHelpRequest[]>;
    createPeerHelpRequest(req: any, requestDto: PeerHelpRequestDto): Promise<import("../entities/user.entity").PeerHelpRequest>;
    getChatHistory(userId: string, req: any): Promise<import("../entities/user.entity").ChatMessage[]>;
    sendMessage(userId: string, req: any, messageDto: ChatMessageDto): Promise<import("../entities/user.entity").ChatMessage>;
}
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardData(req: any): Promise<any>;
}
export declare class HealthController {
    healthCheck(): Promise<{
        status: string;
        service: string;
    }>;
}
