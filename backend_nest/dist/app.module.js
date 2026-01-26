"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const user_service_1 = require("./services/user.service");
const jwt_strategy_1 = require("./middleware/jwt.strategy");
const user_controller_1 = require("./controllers/user.controller");
const social_controller_1 = require("./controllers/social.controller");
const user_entity_1 = require("./entities/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                entities: [user_entity_1.User, user_entity_1.Task, user_entity_1.Submission, user_entity_1.WalletTransaction, user_entity_1.Notification, user_entity_1.PeerHelpRequest, user_entity_1.ChatMessage, user_entity_1.DailyMultiplier],
                synchronize: true,
                autoLoadEntities: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User, user_entity_1.Task, user_entity_1.Submission, user_entity_1.WalletTransaction,
                user_entity_1.Notification, user_entity_1.PeerHelpRequest, user_entity_1.ChatMessage, user_entity_1.DailyMultiplier
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'elaccess_secret_key_for_dev',
                signOptions: { expiresIn: '30m' },
            }),
            passport_1.PassportModule,
        ],
        controllers: [
            user_controller_1.AuthController, user_controller_1.UserController, user_controller_1.TaskController,
            user_controller_1.SubmissionController, user_controller_1.WalletController, user_controller_1.NotificationController,
            user_controller_1.PeerHelpController, user_controller_1.DashboardController, user_controller_1.HealthController,
            social_controller_1.SocialController
        ],
        providers: [
            user_service_1.AuthService, user_service_1.UserService, user_service_1.TaskService, user_service_1.SubmissionService,
            user_service_1.WalletService, user_service_1.NotificationService, user_service_1.PeerHelpService,
            user_service_1.ChatService, user_service_1.DashboardService, jwt_strategy_1.JwtStrategy
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map