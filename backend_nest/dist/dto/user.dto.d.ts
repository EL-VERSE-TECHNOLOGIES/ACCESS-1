export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
}
export declare class UpdateUserDto {
    name?: string;
    tier?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class TaskDto {
    title: string;
    description: string;
    reward: number;
    difficulty: string;
    stack?: string[];
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    reward?: number;
    difficulty?: string;
    status?: string;
}
export declare class SubmissionDto {
    taskId: string;
    taskTitle: string;
    code?: string;
}
export declare class UpdateSubmissionDto {
    status?: string;
    score?: number;
    feedback?: string;
}
export declare class WalletTransactionDto {
    userId: string;
    amount: number;
    transactionType: string;
    transactionSubtype?: string;
    description?: string;
    balanceAfter: number;
}
export declare class NotificationDto {
    userId: string;
    title: string;
    message: string;
    type: string;
}
export declare class UpdateNotificationDto {
    isRead?: boolean;
}
export declare class PeerHelpRequestDto {
    title: string;
    description: string;
}
export declare class UpdatePeerHelpRequestDto {
    status?: string;
    helperId?: string;
}
export declare class ChatMessageDto {
    receiverId: string;
    message: string;
    messageType?: string;
}
export declare class DashboardResponseDto {
    user: any;
    hotTasks: any[];
    recentActivity: any[];
    submissions: any[];
    tasks: any[];
}
