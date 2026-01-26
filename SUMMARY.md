# EL ACCESS - Complete Application Setup Guide

## Overview
EL ACCESS is a comprehensive internship and growth portal with three backend implementations (Python, Go, Node.js) and a Next.js frontend.

## Project Structure
```
ACCESS-1/
├── README.md                    # Main project documentation
├── backend_architecture.md      # Backend architecture overview
├── database_schema.sql          # Database schema definition
├── backend_python/             # Python backend (FastAPI)
├── backend_go/                 # Go backend (Gin)
├── backend_nest/               # Node.js backend (NestJS)
└── frontend/                   # Next.js frontend
```

## Setting Up the Full Application

### 1. Database Setup
First, set up your PostgreSQL database:
```sql
-- Create the database
CREATE DATABASE elaccess;

-- Apply the schema
\i /path/to/database_schema.sql
```

### 2. Backend Options (Choose One)

#### Option A: Python Backend
```bash
# Navigate to the Python backend
cd backend_python/

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://username:password@localhost/elaccess"
export SECRET_KEY="your-super-secret-key"

# Run the server
uvicorn main:app --reload --port 8000
```

#### Option B: Go Backend
```bash
# Navigate to the Go backend
cd backend_go/

# Install dependencies
go mod tidy

# Set environment variables
export DATABASE_URL="host=localhost user=username password=password dbname=elaccess port=5432 sslmode=disable"
export JWT_SECRET="your-jwt-secret"

# Run the server
go run main.go
```

#### Option C: Node.js Backend
```bash
# Navigate to the Node.js backend
cd backend_nest/

# Install dependencies
npm install

# Set environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=username
export DB_PASSWORD=password
export DB_NAME=elaccess
export JWT_SECRET=your-jwt-secret

# Run the server
npm run start:dev
```

### 3. Frontend Setup
```bash
# Navigate to the frontend
cd frontend/

# Install dependencies
npm install

# Configure the API base URL to match your chosen backend:
# For Python backend: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# For Go backend: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  
# For Node.js backend: NEXT_PUBLIC_API_BASE_URL=http://localhost:8001

# Create .env.local file
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local

# Run the frontend
npm run dev
```

## API Endpoints Reference

All backends implement the same API contract:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/leaderboard` - Get leaderboard

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `GET /api/tasks/hot` - Get trending tasks
- `POST /api/tasks/:taskId/submit` - Submit task solution

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/transactions` - Get transaction history

### Dashboard
- `GET /api/access/dashboard` - Get dashboard data

### Health Check
- `GET /api/health` - Health check endpoint

## Environment Variables

### Python Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost/elaccess
SECRET_KEY=your-super-secret-key
```

### Go Backend (environment)
```
DATABASE_URL=host=localhost user=user password=password dbname=elaccess port=5432 sslmode=disable
JWT_SECRET=your-jwt-secret
PORT=8000
```

### Node.js Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=password
DB_NAME=elaccess
JWT_SECRET=your-jwt-secret
PORT=8001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # Match your backend port
```

## Running in Production

For production deployment:

1. Use environment-specific configurations
2. Set up SSL certificates
3. Use a process manager for backend services (PM2 for Node.js, Gunicorn for Python, systemd for Go)
4. Set up a reverse proxy (nginx/Apache)
5. Implement proper logging and monitoring
6. Use environment variables for configuration
7. Set up automated backups for the database

## Key Features

- **Authentication & Authorization**: JWT-based secure access
- **Task Management**: Create, assign, and track tasks
- **Reward System**: Stipend wallet with transaction history
- **Peer Help**: Community support system
- **Real-time Updates**: Live dashboard and notifications
- **Progress Tracking**: Gamified learning progression
- **Secure Verification**: Facial liveness detection

## Technologies Used

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Socket.IO Client

### Python Backend
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Go Backend
- Gin Framework
- GORM
- JWT-Go

### Node.js Backend
- NestJS
- TypeORM
- TypeScript
- Passport.js

### Database
- PostgreSQL

## Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **Port Conflicts**: Make sure ports 3000 (frontend), 8000/8001 (backend) are available
3. **Environment Variables**: Verify all required environment variables are set
4. **CORS Errors**: Backend CORS settings allow frontend origin

### API Documentation:
- Python backend: http://localhost:8000/docs
- Go backend: Routes defined in main.go
- Node.js backend: http://localhost:8001/api (Swagger if configured)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test all backends to ensure API consistency
5. Update documentation as needed
6. Submit a pull request

## License

This project is licensed under the MIT License.