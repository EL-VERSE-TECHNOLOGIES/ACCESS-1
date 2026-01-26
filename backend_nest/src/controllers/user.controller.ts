import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/user.service';
import { UserService, TaskService, SubmissionService, WalletService, NotificationService, PeerHelpService, ChatService, DashboardService } from '../services/user.service';
import { CreateUserDto, LoginDto, TaskDto, UpdateTaskDto, SubmissionDto, UpdateSubmissionDto, UpdateUserDto, WalletTransactionDto, NotificationDto, UpdateNotificationDto, PeerHelpRequestDto, UpdatePeerHelpRequestDto, ChatMessageDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('auth/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user.id);
  }
}

@Controller('api')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users/profile')
  async getProfile(@Req() req) {
    return this.userService.findOneById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/profile')
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/leaderboard')
  async getLeaderboard() {
    return this.userService.getLeaderboard();
  }
}

@Controller('api')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private submissionService: SubmissionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('tasks')
  async getTasks(@Query('status') status?: string) {
    return this.taskService.findAll(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/:id')
  async getTask(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tasks')
  async createTask(@Req() req, @Body() taskDto: TaskDto) {
    return this.taskService.create(taskDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('tasks/:id')
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/hot')
  async getHotTasks() {
    return this.taskService.getHotTasks();
  }

  @UseGuards(JwtAuthGuard)
  @Post('tasks/:taskId/submit')
  async submitTask(@Param('taskId') taskId: string, @Req() req, @Body() submissionDto: SubmissionDto) {
    // Override taskId to ensure consistency with URL param
    submissionDto.taskId = taskId;
    return this.submissionService.create(submissionDto, req.user.id);
  }
}

@Controller('api')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @UseGuards(JwtAuthGuard)
  @Get('tasks/submissions')
  async getUserSubmissions(@Req() req) {
    return this.submissionService.findByUser(req.user.id);
  }
}

@Controller('api')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get('wallet/balance')
  async getBalance(@Req() req) {
    return { balance: await this.walletService.getBalance(req.user.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallet/transactions')
  async getTransactions(@Req() req) {
    return this.walletService.getTransactions(req.user.id);
  }
}

@Controller('api')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async getNotifications(@Req() req) {
    return this.notificationService.findByUser(req.user.id);
  }
}

@Controller('api')
export class PeerHelpController {
  constructor(
    private peerHelpService: PeerHelpService,
    private chatService: ChatService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('peer-help/requests')
  async getPeerHelpRequests() {
    return this.peerHelpService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('peer-help/requests')
  async createPeerHelpRequest(@Req() req, @Body() requestDto: PeerHelpRequestDto) {
    return this.peerHelpService.create(requestDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('peer-help/chat/:userId')
  async getChatHistory(@Param('userId') userId: string, @Req() req) {
    return this.chatService.getChatHistory(req.user.id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('peer-help/chat/:userId')
  async sendMessage(@Param('userId') userId: string, @Req() req, @Body() messageDto: ChatMessageDto) {
    // Override receiverId to ensure consistency with URL param
    messageDto.receiverId = userId;
    return this.chatService.sendMessage(messageDto, req.user.id);
  }
}

@Controller('api')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('access/dashboard')
  async getDashboardData(@Req() req) {
    return this.dashboardService.getDashboardData(req.user.id);
  }
}

@Controller('api')
export class HealthController {
  @Get('health')
  async healthCheck() {
    return { status: 'healthy', service: 'nodejs-backend' };
  }
}