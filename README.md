# EL ACCESS - Internship & Growth Portal

EL ACCESS is a comprehensive internship and growth portal that enables users to complete tasks, earn rewards, and advance their skills through a gamified learning experience.

## Project Structure

```
ACCESS-1/
├── README.md
├── backend_architecture.md
├── database_schema.sql
├── backend_python/     # Python backend with FastAPI
├── backend_go/         # Go backend with Gin
├── backend_nest/       # Node.js backend with NestJS
└── frontend/           # Next.js frontend
```

## Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Browse, create, and submit tasks
- **Reward System**: Earn stipends for completing tasks
- **Progress Tracking**: Monitor your advancement through tiers
- **Peer Help**: Get assistance from fellow interns
- **Wallet System**: Track earnings and transactions
- **Gamification**: Daily multipliers and achievement badges

## Backend Implementations

### Python Backend (FastAPI)
- Located in `backend_python/`
- Built with FastAPI and SQLAlchemy
- Async-first framework with automatic API documentation
- Runs on port 8000 by default

### Go Backend (Gin)
- Located in `backend_go/`
- Built with Gin framework and GORM
- High-performance HTTP framework
- Runs on port 8000 by default

### Node.js Backend (NestJS)
- Located in `backend_nest/`
- Built with NestJS and TypeORM
- TypeScript-based progressive Node.js framework
- Runs on port 8001 by default

## Frontend

- Next.js application in `frontend/`
- Responsive design with Tailwind CSS
- Integrated with all backend implementations
- Real-time features with Socket.IO

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users`: User accounts and profiles
- `tasks`: Available tasks and challenges
- `submissions`: User task submissions
- `wallet_transactions`: Financial transactions
- `notifications`: User notifications
- `peer_help_requests`: Peer assistance requests
- `chat_messages`: Direct messaging
- `daily_multipliers`: Daily login bonuses

## API Endpoints

Common API endpoints across all backends:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/profile` - Get user profile
- `GET /api/tasks` - Get available tasks
- `POST /api/tasks/:id/submit` - Submit task solution
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/access/dashboard` - Get dashboard data
- `GET /api/health` - Health check

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+ (for Python backend)
- Go 1.19+ (for Go backend)
- PostgreSQL database
- Docker (optional, for easier setup)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### Backend Setup

#### Python Backend
```bash
cd backend_python
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Go Backend
```bash
cd backend_go
go mod tidy
go run main.go
```

#### Node.js Backend
```bash
cd backend_nest
npm install
npm run start:dev
```

## Configuration

Each backend implementation requires environment variables for database connection and JWT secrets:

### Python Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost/elaccess
SECRET_KEY=your-secret-key
```

### Go Backend (environment variables)
```
DATABASE_URL=postgresql://user:password@localhost/elaccess
JWT_SECRET=your-jwt-secret
```

### Node.js Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=password
DB_NAME=elaccess
JWT_SECRET=your-jwt-secret
```

## Testing

To test the integration between frontend and backend:

1. Start your chosen backend implementation
2. Configure the frontend to use the backend by setting `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Start the frontend
4. Access the application at `http://localhost:3000`

Example `.env.local` for frontend:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.