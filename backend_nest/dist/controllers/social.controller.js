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
exports.HealthController = exports.SocialController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const user_dto_1 = require("../dto/user.dto");
const jwt_auth_guard_1 = require("../middleware/jwt-auth.guard");
let SocialController = class SocialController {
    constructor(notificationService, chatService, peerHelpService) {
        this.notificationService = notificationService;
        this.chatService = chatService;
        this.peerHelpService = peerHelpService;
    }
    async getNotifications(req) {
        return this.notificationService.findByUser(req.user.id);
    }
    async createNotification(req, notificationDto) {
        const newNotification = {
            ...notificationDto,
            userId: req.user.id
        };
        return this.notificationService.create(newNotification);
    }
    async updateNotification(id, updateNotificationDto) {
        return this.notificationService.update(id, updateNotificationDto);
    }
    async getChatHistory(userId, req) {
        return this.chatService.getChatHistory(req.user.id, userId);
    }
    async sendMessage(userId, req, messageDto) {
        const newMessage = {
            ...messageDto,
            senderId: req.user.id,
            receiverId: userId
        };
        return this.chatService.sendMessage(newMessage, req.user.id);
    }
    async getPeerHelpRequests() {
        return this.peerHelpService.findAll();
    }
    async createPeerHelpRequest(req, requestDto) {
        const newRequest = {
            ...requestDto,
            userId: req.user.id
        };
        return this.peerHelpService.create(requestDto, req.user.id);
    }
    async updatePeerHelpRequest(id, updateRequestDto) {
        return this.peerHelpService.update(id, updateRequestDto);
    }
    async deletePeerHelpRequest(id) {
        const updateRequestDto = { status: 'closed' };
        return this.peerHelpService.update(id, updateRequestDto);
    }
};
exports.SocialController = SocialController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('notifications'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.NotificationDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createNotification", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('notifications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "updateNotification", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('peer-help/chat/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getChatHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('peer-help/chat/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_dto_1.ChatMessageDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('peer-help/requests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getPeerHelpRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('peer-help/requests'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.PeerHelpRequestDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createPeerHelpRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('peer-help/requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdatePeerHelpRequestDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "updatePeerHelpRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('peer-help/requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deletePeerHelpRequest", null);
exports.SocialController = SocialController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_1.NotificationService,
        user_service_1.ChatService,
        user_service_1.PeerHelpService])
], SocialController);
let HealthController = class HealthController {
    async healthCheck() {
        return { status: 'healthy', service: 'nodejs-social-backend' };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "healthCheck", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('api')
], HealthController);
//# sourceMappingURL=social.controller.js.map