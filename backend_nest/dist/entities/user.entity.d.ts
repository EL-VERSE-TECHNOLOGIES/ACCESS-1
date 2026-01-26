export declare enum Tier {
    INTERN = "Intern",
    LEAD = "Lead",
    MANAGEMENT = "Management"
}
export declare enum Difficulty {
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold"
}
export declare enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    REVIEW = "REVIEW",
    DONE = "DONE"
}
export declare enum SubmissionStatus {
    PENDING = "pending",
    REVIEWING = "reviewing",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare enum NotificationType {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error"
}
export declare enum PeerHelpStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare enum MessageType {
    TEXT = "text",
    CODE = "code",
    IMAGE = "image"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    tier: Tier;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    faceVerificationStatus: string;
    tasks: Task[];
    submissions: Submission[];
    walletTransactions: WalletTransaction[];
    notifications: Notification[];
    peerHelpRequests: PeerHelpRequest[];
    helpingRequests: PeerHelpRequest[];
    sentMessages: ChatMessage[];
    receivedMessages: ChatMessage[];
}
export declare class Task {
    id: string;
    title: string;
    description: string;
    reward: number;
    difficulty: Difficulty;
    stack: string[];
    status: TaskStatus;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
    submissions: Submission[];
}
export declare class Submission {
    id: string;
    taskId: string;
    userId: string;
    taskTitle: string;
    code: string;
    submittedAt: Date;
    status: SubmissionStatus;
    score: number;
    feedback: string;
    reviewedBy: string;
    reviewedAt: Date;
    task: Task;
    user: User;
}
export declare class WalletTransaction {
    id: string;
    userId: string;
    amount: number;
    transactionType: string;
    transactionSubtype: string;
    description: string;
    balanceAfter: number;
    createdAt: Date;
    user: User;
}
export declare class Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: Date;
    user: User;
}
export declare class PeerHelpRequest {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: PeerHelpStatus;
    helperId: string;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt: Date;
    user: User;
    helper: User;
}
export declare class ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    messageType: MessageType;
    sender: User;
    receiver: User;
}
export declare class DailyMultiplier {
    id: string;
    userId: string;
    date: string;
    multiplier: number;
    claimed: boolean;
    createdAt: Date;
    user: User;
}
