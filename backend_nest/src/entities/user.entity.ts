import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { IsEmail, IsEnum, IsOptional, IsString, IsNumber, IsArray, IsBoolean, IsDateString } from 'class-validator';

export enum Tier {
  INTERN = 'Intern',
  LEAD = 'Lead',
  MANAGEMENT = 'Management',
}

export enum Difficulty {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum SubmissionStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum PeerHelpStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum MessageType {
  TEXT = 'text',
  CODE = 'code',
  IMAGE = 'image',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  name: string;

  @Column({ default: Tier.INTERN })
  @IsEnum(Tier)
  tier: Tier;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ default: 'pending' })
  faceVerificationStatus: string;

  @OneToMany(() => Task, task => task.createdBy)
  tasks: Task[];

  @OneToMany(() => Submission, submission => submission.user)
  submissions: Submission[];

  @OneToMany(() => WalletTransaction, transaction => transaction.user)
  walletTransactions: WalletTransaction[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => PeerHelpRequest, request => request.user)
  peerHelpRequests: PeerHelpRequest[];

  @OneToMany(() => PeerHelpRequest, request => request.helper)
  helpingRequests: PeerHelpRequest[];

  @OneToMany(() => ChatMessage, message => message.sender)
  sentMessages: ChatMessage[];

  @OneToMany(() => ChatMessage, message => message.receiver)
  receivedMessages: ChatMessage[];
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  title: string;

  @Column('text')
  @IsString()
  description: string;

  @Column({ type: 'integer' })
  @IsNumber()
  reward: number; // in cents or smallest currency unit

  @Column()
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  @IsArray()
  stack: string[];

  @Column({ default: TaskStatus.OPEN })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Submission, submission => submission.task)
  submissions: Submission[];
}

@Entity()
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_id' })
  taskId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'task_title' })
  @IsString()
  taskTitle: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  code: string;

  @Column({ name: 'submitted_at', type: 'timestamp' })
  submittedAt: Date;

  @Column({ default: SubmissionStatus.PENDING })
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  score: number; // 0-100 scale

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  feedback: string;

  @Column({ name: 'reviewed_by', nullable: true })
  @IsOptional()
  reviewedBy: string; // user ID of reviewer

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  @IsOptional()
  reviewedAt: Date;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'integer' })
  @IsNumber()
  amount: number; // in cents or smallest currency unit

  @Column({ name: 'transaction_type' })
  @IsString()
  transactionType: string; // credit, debit

  @Column({ name: 'transaction_subtype', nullable: true })
  @IsOptional()
  transactionSubtype: string; // task_completion, withdrawal, bonus, penalty

  @Column({ nullable: true })
  @IsOptional()
  description: string;

  @Column({ name: 'balance_after', type: 'integer' })
  @IsNumber()
  balanceAfter: number; // balance after transaction

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  @IsString()
  title: string;

  @Column('text')
  @IsString()
  message: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsEnum(NotificationType)
  type: NotificationType;

  @Column({ default: false })
  @IsBoolean()
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity()
export class PeerHelpRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  @IsString()
  title: string;

  @Column('text')
  @IsString()
  description: string;

  @Column({ default: PeerHelpStatus.OPEN })
  @IsEnum(PeerHelpStatus)
  status: PeerHelpStatus;

  @Column({ name: 'helper_id', nullable: true })
  @IsOptional()
  helperId: string; // user assigned to help

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  @IsOptional()
  resolvedAt: Date;

  @ManyToOne(() => User, user => user.peerHelpRequests)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, user => user.helpingRequests)
  @JoinColumn({ name: 'helper_id' })
  helper: User;
}

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ name: 'receiver_id' })
  receiverId: string;

  @Column('text')
  @IsString()
  message: string;

  @Column({ default: false })
  @IsBoolean()
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'message_type', default: MessageType.TEXT })
  @IsEnum(MessageType)
  messageType: MessageType; // text, code, image

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, user => user.receivedMessages)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;
}

@Entity()
export class DailyMultiplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'date' })
  @IsDateString()
  date: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.00 })
  multiplier: number;

  @Column({ default: false })
  @IsBoolean()
  claimed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}