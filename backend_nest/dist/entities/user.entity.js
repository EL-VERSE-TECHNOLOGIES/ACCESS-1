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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyMultiplier = exports.ChatMessage = exports.PeerHelpRequest = exports.Notification = exports.WalletTransaction = exports.Submission = exports.Task = exports.User = exports.MessageType = exports.PeerHelpStatus = exports.NotificationType = exports.SubmissionStatus = exports.TaskStatus = exports.Difficulty = exports.Tier = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
var Tier;
(function (Tier) {
    Tier["INTERN"] = "Intern";
    Tier["LEAD"] = "Lead";
    Tier["MANAGEMENT"] = "Management";
})(Tier || (exports.Tier = Tier = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty["BRONZE"] = "bronze";
    Difficulty["SILVER"] = "silver";
    Difficulty["GOLD"] = "gold";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["OPEN"] = "OPEN";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["REVIEW"] = "REVIEW";
    TaskStatus["DONE"] = "DONE";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["PENDING"] = "pending";
    SubmissionStatus["REVIEWING"] = "reviewing";
    SubmissionStatus["APPROVED"] = "approved";
    SubmissionStatus["REJECTED"] = "rejected";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["INFO"] = "info";
    NotificationType["SUCCESS"] = "success";
    NotificationType["WARNING"] = "warning";
    NotificationType["ERROR"] = "error";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var PeerHelpStatus;
(function (PeerHelpStatus) {
    PeerHelpStatus["OPEN"] = "open";
    PeerHelpStatus["IN_PROGRESS"] = "in_progress";
    PeerHelpStatus["RESOLVED"] = "resolved";
    PeerHelpStatus["CLOSED"] = "closed";
})(PeerHelpStatus || (exports.PeerHelpStatus = PeerHelpStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["CODE"] = "code";
    MessageType["IMAGE"] = "image";
})(MessageType || (exports.MessageType = MessageType = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: Tier.INTERN }),
    (0, class_validator_1.IsEnum)(Tier),
    __metadata("design:type", String)
], User.prototype, "tier", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], User.prototype, "faceVerificationStatus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task, task => task.createdBy),
    __metadata("design:type", Array)
], User.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Submission, submission => submission.user),
    __metadata("design:type", Array)
], User.prototype, "submissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => WalletTransaction, transaction => transaction.user),
    __metadata("design:type", Array)
], User.prototype, "walletTransactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notification, notification => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PeerHelpRequest, request => request.user),
    __metadata("design:type", Array)
], User.prototype, "peerHelpRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PeerHelpRequest, request => request.helper),
    __metadata("design:type", Array)
], User.prototype, "helpingRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChatMessage, message => message.sender),
    __metadata("design:type", Array)
], User.prototype, "sentMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChatMessage, message => message.receiver),
    __metadata("design:type", Array)
], User.prototype, "receivedMessages", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
let Task = class Task {
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Task.prototype, "reward", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsEnum)(Difficulty),
    __metadata("design:type", String)
], Task.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { default: '' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Task.prototype, "stack", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: TaskStatus.OPEN }),
    (0, class_validator_1.IsEnum)(TaskStatus),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, user => user.tasks),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", User)
], Task.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Submission, submission => submission.task),
    __metadata("design:type", Array)
], Task.prototype, "submissions", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)()
], Task);
let Submission = class Submission {
};
exports.Submission = Submission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Submission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_id' }),
    __metadata("design:type", String)
], Submission.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Submission.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Submission.prototype, "taskTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Submission.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submitted_at', type: 'datetime' }),
    __metadata("design:type", Date)
], Submission.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: SubmissionStatus.PENDING }),
    (0, class_validator_1.IsEnum)(SubmissionStatus),
    __metadata("design:type", String)
], Submission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Submission.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Submission.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewed_by', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Submission.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewed_at', type: 'datetime', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], Submission.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", Task)
], Submission.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User)
], Submission.prototype, "user", void 0);
exports.Submission = Submission = __decorate([
    (0, typeorm_1.Entity)()
], Submission);
let WalletTransaction = class WalletTransaction {
};
exports.WalletTransaction = WalletTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WalletTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], WalletTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WalletTransaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_subtype', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WalletTransaction.prototype, "transactionSubtype", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WalletTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_after', type: 'integer' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], WalletTransaction.prototype, "balanceAfter", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WalletTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User)
], WalletTransaction.prototype, "user", void 0);
exports.WalletTransaction = WalletTransaction = __decorate([
    (0, typeorm_1.Entity)()
], WalletTransaction);
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(NotificationType),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User)
], Notification.prototype, "user", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)()
], Notification);
let PeerHelpRequest = class PeerHelpRequest {
};
exports.PeerHelpRequest = PeerHelpRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PeerHelpRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], PeerHelpRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PeerHelpRequest.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PeerHelpRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: PeerHelpStatus.OPEN }),
    (0, class_validator_1.IsEnum)(PeerHelpStatus),
    __metadata("design:type", String)
], PeerHelpRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'helper_id', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PeerHelpRequest.prototype, "helperId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PeerHelpRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PeerHelpRequest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolved_at', type: 'datetime', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], PeerHelpRequest.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, user => user.peerHelpRequests),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User)
], PeerHelpRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, user => user.helpingRequests),
    (0, typeorm_1.JoinColumn)({ name: 'helper_id' }),
    __metadata("design:type", User)
], PeerHelpRequest.prototype, "helper", void 0);
exports.PeerHelpRequest = PeerHelpRequest = __decorate([
    (0, typeorm_1.Entity)()
], PeerHelpRequest);
let ChatMessage = class ChatMessage {
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sender_id' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receiver_id' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "receiverId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChatMessage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'message_type', default: MessageType.TEXT }),
    (0, class_validator_1.IsEnum)(MessageType),
    __metadata("design:type", String)
], ChatMessage.prototype, "messageType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, user => user.sentMessages),
    (0, typeorm_1.JoinColumn)({ name: 'sender_id' }),
    __metadata("design:type", User)
], ChatMessage.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, user => user.receivedMessages),
    (0, typeorm_1.JoinColumn)({ name: 'receiver_id' }),
    __metadata("design:type", User)
], ChatMessage.prototype, "receiver", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typeorm_1.Entity)()
], ChatMessage);
let DailyMultiplier = class DailyMultiplier {
};
exports.DailyMultiplier = DailyMultiplier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyMultiplier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], DailyMultiplier.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DailyMultiplier.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 1.00 }),
    __metadata("design:type", Number)
], DailyMultiplier.prototype, "multiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DailyMultiplier.prototype, "claimed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DailyMultiplier.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User)
], DailyMultiplier.prototype, "user", void 0);
exports.DailyMultiplier = DailyMultiplier = __decorate([
    (0, typeorm_1.Entity)()
], DailyMultiplier);
//# sourceMappingURL=user.entity.js.map