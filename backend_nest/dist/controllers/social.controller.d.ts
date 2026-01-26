import { NotificationService, ChatService, PeerHelpService } from '../services/user.service';
import { NotificationDto, UpdateNotificationDto, ChatMessageDto, PeerHelpRequestDto, UpdatePeerHelpRequestDto } from '../dto/user.dto';
export declare class SocialController {
    private notificationService;
    private chatService;
    private peerHelpService;
    constructor(notificationService: NotificationService, chatService: ChatService, peerHelpService: PeerHelpService);
    getNotifications(req: any): Promise<import("../entities/user.entity").Notification[]>;
    createNotification(req: any, notificationDto: NotificationDto): Promise<import("../entities/user.entity").Notification>;
    updateNotification(id: string, updateNotificationDto: UpdateNotificationDto): Promise<import("../entities/user.entity").Notification>;
    getChatHistory(userId: string, req: any): Promise<import("../entities/user.entity").ChatMessage[]>;
    sendMessage(userId: string, req: any, messageDto: ChatMessageDto): Promise<import("../entities/user.entity").ChatMessage>;
    getPeerHelpRequests(): Promise<import("../entities/user.entity").PeerHelpRequest[]>;
    createPeerHelpRequest(req: any, requestDto: PeerHelpRequestDto): Promise<import("../entities/user.entity").PeerHelpRequest>;
    updatePeerHelpRequest(id: string, updateRequestDto: UpdatePeerHelpRequestDto): Promise<import("../entities/user.entity").PeerHelpRequest>;
    deletePeerHelpRequest(id: string): Promise<import("../entities/user.entity").PeerHelpRequest>;
}
export declare class HealthController {
    healthCheck(): Promise<{
        status: string;
        service: string;
    }>;
}
