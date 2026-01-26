import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationService, ChatService, PeerHelpService } from '../services/user.service';
import { NotificationDto, UpdateNotificationDto, ChatMessageDto, PeerHelpRequestDto, UpdatePeerHelpRequestDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Controller('api')
export class SocialController {
  constructor(
    private notificationService: NotificationService,
    private chatService: ChatService,
    private peerHelpService: PeerHelpService,
  ) {}

  // Notifications endpoints
  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async getNotifications(@Req() req) {
    return this.notificationService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications')
  async createNotification(@Req() req, @Body() notificationDto: NotificationDto) {
    // Create a new object with the required properties
    const newNotification = {
      ...notificationDto,
      userId: req.user.id
    };
    return this.notificationService.create(newNotification);
  }

  @UseGuards(JwtAuthGuard)
  @Put('notifications/:id')
  async updateNotification(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  // Chat endpoints
  @UseGuards(JwtAuthGuard)
  @Get('peer-help/chat/:userId')
  async getChatHistory(@Param('userId') userId: string, @Req() req) {
    return this.chatService.getChatHistory(req.user.id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('peer-help/chat/:userId')
  async sendMessage(@Param('userId') userId: string, @Req() req, @Body() messageDto: ChatMessageDto) {
    // Create a new object with the required properties
    const newMessage = {
      ...messageDto,
      senderId: req.user.id,
      receiverId: userId
    };
    return this.chatService.sendMessage(newMessage, req.user.id);
  }

  // Peer Help endpoints
  @UseGuards(JwtAuthGuard)
  @Get('peer-help/requests')
  async getPeerHelpRequests() {
    return this.peerHelpService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('peer-help/requests')
  async createPeerHelpRequest(@Req() req, @Body() requestDto: PeerHelpRequestDto) {
    // Create a new object with the required properties
    const newRequest = {
      ...requestDto,
      userId: req.user.id
    };
    return this.peerHelpService.create(requestDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('peer-help/requests/:id')
  async updatePeerHelpRequest(@Param('id') id: string, @Body() updateRequestDto: UpdatePeerHelpRequestDto) {
    return this.peerHelpService.update(id, updateRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('peer-help/requests/:id')
  async deletePeerHelpRequest(@Param('id') id: string) {
    // Since there's no remove method, we'll update the status to 'closed'
    const updateRequestDto: UpdatePeerHelpRequestDto = { status: 'closed' };
    return this.peerHelpService.update(id, updateRequestDto);
  }
}

@Controller('api')
export class HealthController {
  @Get('health')
  async healthCheck() {
    return { status: 'healthy', service: 'nodejs-social-backend' };
  }
}