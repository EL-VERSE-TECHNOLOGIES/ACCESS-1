# EL ACCESS - Internship & Growth Portal

EL ACCESS is a comprehensive internship and growth portal that enables users to complete tasks, earn rewards, and advance their skills through a gamified learning experience. The platform features three backend implementations (Python, Go, Node.js) with dynamic switching capabilities and a robust Next.js frontend.

## Project Structure

```
ACCESS-1/
├── README.md
├── PRODUCTION_READY.md
├── backend_architecture.md
├── database_schema.sql
├── backend_python/     # Python backend with FastAPI
├── backend_go/         # Go backend with Gin
├── backend_nest/       # Node.js backend with NestJS
└── frontend/           # Next.js frontend with assets
    ├── public/images/  # Logo and loader assets
    ├── components/     # Reusable UI components
    ├── lib/            # API and utility functions
    └── pages/          # Application pages
```

## Key Features

- **Dynamic Backend Switching**: Seamlessly switch between Python, Go, and Node.js backends
- **Asset Integration**: Professional logo and animated loader
- **Health Monitoring**: Real-time backend health check page
- **Error Handling**: Global error provider with notifications
- **Loading States**: Consistent loading indicators throughout
- **User Authentication**: Secure login and registration system
- **Task Management**: Browse, create, and submit tasks
- **Reward System**: Earn stipends for completing tasks
- **Progress Tracking**: Monitor your advancement through tiers
- **Peer Help**: Get assistance from fellow interns
- **Wallet System**: Track earnings and transactions
- **Gamification**: Daily multipliers and achievement badges

## Frontend Enhancements

### Assets
- **Logo**: `/public/images/logo.svg` - Professional brand identity
- **Loader**: `/public/images/loader.svg` - Animated loading indicator

### Components
- **Backend Selector**: Dropdown to switch between backend implementations
- **Loader Component**: Configurable loading indicators
- **Error Provider**: Global error notifications
- **Health Check Page**: Monitor all backend statuses

### API Integration
- **Dynamic Backend Switching**: Automatically updates API URLs
- **Centralized Configuration**: `/lib/backend-config.ts`
- **Unified API Client**: Single client for all requests
- **Token Management**: Automatic JWT handling

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
cp .env.example .env.local  # Configure your backend URLs
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

### Frontend Environment Variables (.env.local)
```
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_PYTHON_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_GO_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_NODEJS_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_DEFAULT_BACKEND=python

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# Other configurations
NEXT_PUBLIC_S3_BUCKET=
```

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

## Production Features

### Dynamic Backend Switching
- Switch between Python, Go, and Node.js backends at runtime
- Persistent selection using localStorage
- Automatic API URL updates
- Health check page to monitor all backends

### Error Handling
- Global error provider with toast notifications
- Proper error boundaries for all pages
- Detailed error messages
- Automatic error recovery

### Loading States
- Custom loader component with multiple sizes
- Loading states for all data-fetching operations
- Consistent user experience
- Visual feedback during API calls

### Asset Management
- SVG logo for scalability
- Animated loader for better UX
- Optimized for performance
- Responsive design

## Deployment

### Local Development
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (choose one)
# Python backend
cd backend_python
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Go backend
cd backend_go
go mod tidy
go run main.go

# Node.js backend
cd backend_nest
npm install
npm run start:dev
```

### Vercel Deployment (Recommended)

The application is optimized for Vercel deployment:

1. **Prepare your backend services**:
   - Deploy your Python, Go, or Node.js backend to a hosting service
   - Make sure your backend is accessible via HTTPS

2. **Set environment variables in Vercel**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
   NEXT_PUBLIC_PYTHON_BACKEND_URL=https://your-python-backend.com
   NEXT_PUBLIC_GO_BACKEND_URL=https://your-go-backend.com
   NEXT_PUBLIC_NODEJS_BACKEND_URL=https://your-nodejs-backend.com
   NEXT_PUBLIC_DEFAULT_BACKEND=python
   NEXT_PUBLIC_WS_URL=wss://your-websocket-domain.com
   ```

3. **Deploy to Vercel**:
   - Import your GitHub repository in Vercel
   - Vercel will automatically detect this as a Next.js project
   - Set build command to `cd frontend && npm run build`
   - Add the environment variables in the Vercel dashboard
   - Deploy!

### Production Deployment
```bash
# Frontend
npm run build
npm run start  # Production server

# Backend (Choose one)
# Python: Deploy with Gunicorn/uWSGI
# Go: Compile binary and deploy
# Node.js: Deploy with PM2 or similar
```

## Testing

To test the integration between frontend and backend:

1. Start your chosen backend implementation
2. Configure the frontend to use the backend by setting environment variables in `.env.local`
3. Start the frontend
4. Access the application at `http://localhost:3000`
5. Use the backend selector to switch between implementations
6. Visit `/health` to check all backend statuses

## Deployment

### Local Development
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (choose one)
# Python backend
cd backend_python
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Go backend
cd backend_go
go mod tidy
go run main.go

# Node.js backend
cd backend_nest
npm install
npm run start:dev
```

### Production Deployment
```bash
# Frontend
npm run build
npm run start  # Production server

# Backend (Choose one)
# Python: Deploy with Gunicorn/uWSGI
# Go: Compile binary and deploy
# Node.js: Deploy with PM2 or similar
```

### Vercel Deployment
The application is configured for one-click deployment on Vercel:
1. Push to GitHub
2. Import project in Vercel
3. Select Next.js framework preset
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.