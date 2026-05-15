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
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'elaccess',
      entities: [User, Task, Submission, WalletTransaction, Notification, PeerHelpRequest, ChatMessage, DailyMultiplier],
      synchronize: true, // Note: Don't use synchronize in production
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      User, Task, Submission, WalletTransaction,
      Notification, PeerHelpRequest, ChatMessage, DailyMultiplier
    ]),
    JwtModule.register({
      // Shared secret key for JWT synchronization across the ecosystem
      secret: process.env.JWT_SECRET || 'elaccess_shared_secret_key_2024',
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
