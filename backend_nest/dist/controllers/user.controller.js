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
exports.HealthController = exports.DashboardController = exports.PeerHelpController = exports.NotificationController = exports.WalletController = exports.SubmissionController = exports.TaskController = exports.UserController = exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const user_service_2 = require("../services/user.service");
const user_dto_1 = require("../dto/user.dto");
const jwt_auth_guard_1 = require("../middleware/jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async register(createUserDto) {
        return this.authService.register(createUserDto);
    }
    async getProfile(req) {
        return this.authService.getProfile(req.user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('auth/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('auth/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('auth/me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_1.AuthService])
], AuthController);
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getProfile(req) {
        return this.userService.findOneById(req.user.id);
    }
    async updateProfile(req, updateUserDto) {
        return this.userService.updateProfile(req.user.id, updateUserDto);
    }
    async getLeaderboard() {
        return this.userService.getLeaderboard();
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('users/profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('users/profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('users/leaderboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLeaderboard", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_2.UserService])
], UserController);
let TaskController = class TaskController {
    constructor(taskService, submissionService) {
        this.taskService = taskService;
        this.submissionService = submissionService;
    }
    async getTasks(status) {
        return this.taskService.findAll(status);
    }
    async getTask(id) {
        return this.taskService.findOne(id);
    }
    async createTask(req, taskDto) {
        return this.taskService.create(taskDto, req.user.id);
    }
    async updateTask(id, updateTaskDto) {
        return this.taskService.update(id, updateTaskDto);
    }
    async getHotTasks() {
        return this.taskService.getHotTasks();
    }
    async submitTask(taskId, req, submissionDto) {
        submissionDto.taskId = taskId;
        return this.submissionService.create(submissionDto, req.user.id);
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('tasks'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTasks", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTask", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('tasks'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.TaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTask", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('tasks/hot'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getHotTasks", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('tasks/:taskId/submit'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_dto_1.SubmissionDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "submitTask", null);
exports.TaskController = TaskController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_2.TaskService,
        user_service_2.SubmissionService])
], TaskController);
let SubmissionController = class SubmissionController {
    constructor(submissionService) {
        this.submissionService = submissionService;
    }
    async getUserSubmissions(req) {
        return this.submissionService.findByUser(req.user.id);
    }
};
exports.SubmissionController = SubmissionController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('tasks/submissions'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "getUserSubmissions", null);
exports.SubmissionController = SubmissionController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_2.SubmissionService])
], SubmissionController);
let WalletController = class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
    }
    async getBalance(req) {
        return { balance: await this.walletService.getBalance(req.user.id) };
    }
    async getTransactions(req) {
        return this.walletService.getTransactions(req.user.id);
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('wallet/balance'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getBalance", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('wallet/transactions'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getTransactions", null);
exports.WalletController = WalletController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_2.WalletService])
], WalletController);
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotifications(req) {
        return this.notificationService.findByUser(req.user.id);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_2.NotificationService])
], NotificationController);
let PeerHelpController = class PeerHelpController {
    constructor(peerHelpService, chatService) {
        this.peerHelpService = peerHelpService;
        this.chatService = chatService;
    }
    async getPeerHelpRequests() {
        return this.peerHelpService.findAll();
    }
    async createPeerHelpRequest(req, requestDto) {
        return this.peerHelpService.create(requestDto, req.user.id);
    }
    async getChatHistory(userId, req) {
        return this.chatService.getChatHistory(req.user.id, userId);
    }
    async sendMessage(userId, req, messageDto) {
        messageDto.receiverId = userId;
        return this.chatService.sendMessage(messageDto, req.user.id);
    }
};
exports.PeerHelpController = PeerHelpController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('peer-help/requests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PeerHelpController.prototype, "getPeerHelpRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('peer-help/requests'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.PeerHelpRequestDto]),
    __metadata("design:returntype", Promise)
], PeerHelpController.prototype, "createPeerHelpRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('peer-help/chat/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PeerHelpController.prototype, "getChatHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('peer-help/chat/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_dto_1.ChatMessageDto]),
    __metadata("design:returntype", Promise)
], PeerHelpController.prototype, "sendMessage", null);
exports.PeerHelpController = PeerHelpController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_2.PeerHelpService,
        user_service_2.ChatService])
], PeerHelpController);
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getDashboardData(req) {
        return this.dashboardService.getDashboardData(req.user.id);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('access/dashboard'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardData", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_2.DashboardService])
], DashboardController);
let HealthController = class HealthController {
    async healthCheck() {
        return { status: 'healthy', service: 'nodejs-backend' };
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
//# sourceMappingURL=user.controller.js.map