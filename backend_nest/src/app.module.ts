import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService, UserService, TaskService, SubmissionService, WalletService, NotificationService, PeerHelpService, ChatService, DashboardService } from './services/user.service';
import { JwtStrategy } from './middleware/jwt.strategy';
import { AuthController, UserController, TaskController, SubmissionController, WalletController, NotificationController, PeerHelpController, DashboardController, HealthController } from './controllers/user.controller';
import { SocialController } from './controllers/social.controller';
import { User, Task, Submission, WalletTransaction, Notification, PeerHelpRequest, ChatMessage, DailyMultiplier } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite', // Changed to SQLite for easier development
      database: 'elaccess.sqlite', // File-based database for persistence
      entities: [User, Task, Submission, WalletTransaction, Notification, PeerHelpRequest, ChatMessage, DailyMultiplier],
      synchronize: true, // Note: Don't use synchronize in production
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      User, Task, Submission, WalletTransaction,
      Notification, PeerHelpRequest, ChatMessage, DailyMultiplier
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'elaccess_secret_key_for_dev',
      signOptions: { expiresIn: '30m' },
    }),
    PassportModule,
  ],
  controllers: [
    AuthController, UserController, TaskController,
    SubmissionController, WalletController, NotificationController,
    PeerHelpController, DashboardController, HealthController,
    SocialController
  ],
  providers: [
    AuthService, UserService, TaskService, SubmissionService, 
    WalletService, NotificationService, PeerHelpService, 
    ChatService, DashboardService, JwtStrategy
  ],
})
export class AppModule {}