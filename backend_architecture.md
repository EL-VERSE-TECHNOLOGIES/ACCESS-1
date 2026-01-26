# EL ACCESS Backend Architecture

## Overview
The EL ACCESS platform is an internship and growth portal with the following core features:
- User authentication and profiles
- Task management system with rewards
- Stipend/wallet system
- Peer help and chat functionality
- Progression and gamification elements
- Facial liveness verification

## Backend Options
The platform will support three backend implementations:
1. Python (FastAPI)
2. Go (Gin framework)
3. Node.js (NestJS)

## Common API Contract
All backends will implement the same REST API contract to ensure frontend compatibility.

## Core Features & Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/verify-face

### User Profiles
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users/:id
- GET /api/users/leaderboard

### Tasks
- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks/:id/submit
- GET /api/tasks/hot
- GET /api/tasks/submissions
- PUT /api/tasks/submissions/:id/review

### Wallet/Stipend System
- GET /api/wallet/balance
- GET /api/wallet/transactions
- POST /api/wallet/withdraw
- GET /api/wallet/daily-multiplier

### Dashboard
- GET /api/access/dashboard
- GET /api/access/recent-activity

### Notifications
- GET /api/notifications
- PUT /api/notifications/:id/read

### Peer Help
- GET /api/peer-help/requests
- POST /api/peer-help/requests
- DELETE /api/peer-help/requests/:id
- GET /api/peer-help/chat/:userId
- POST /api/peer-help/chat/:userId

### Health Check
- GET /api/health

## Database Schema
- Users table
- Tasks table
- Submissions table
- Wallet transactions table
- Notifications table
- Chat messages table
- Peer help requests table

## Technology Stack
- Frontend: Next.js (existing)
- Backends: Python/FastAPI, Go/Gin, Node.js/NestJS
- Database: PostgreSQL
- Real-time: Socket.IO (for chat)
- Authentication: JWT tokens
- File Storage: For facial recognition images