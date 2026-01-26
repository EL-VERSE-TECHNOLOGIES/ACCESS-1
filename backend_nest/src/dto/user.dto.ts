import { IsEmail, IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  tier?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class TaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  reward: number;

  @IsString()
  difficulty: string;

  @IsOptional()
  @IsString({ each: true })
  stack?: string[];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  reward?: number;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class SubmissionDto {
  @IsString()
  taskId: string;

  @IsString()
  taskTitle: string;

  @IsOptional()
  @IsString()
  code?: string;
}

export class UpdateSubmissionDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}

export class WalletTransactionDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsString()
  transactionType: string;

  @IsOptional()
  @IsString()
  transactionSubtype?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  balanceAfter: number;
}

export class NotificationDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  type: string;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class PeerHelpRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdatePeerHelpRequestDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  helperId?: string;
}

export class ChatMessageDto {
  @IsString()
  receiverId: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  messageType?: string;
}

export class DashboardResponseDto {
  user: any;
  hotTasks: any[];
  recentActivity: any[];
  submissions: any[];
  tasks: any[];
}