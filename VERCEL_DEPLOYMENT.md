# EL ACCESS - Vercel Deployment Guide

## Preparing for Vercel Deployment

The EL ACCESS application can be deployed to Vercel with the following considerations:

### Backend Requirements

For the application to work properly on Vercel, you need to have your backend services running separately. The frontend will connect to these backends via API calls.

### Environment Variables for Vercel

When deploying to Vercel, set these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
NEXT_PUBLIC_PYTHON_BACKEND_URL=https://your-python-backend.com
NEXT_PUBLIC_GO_BACKEND_URL=https://your-go-backend.com
NEXT_PUBLIC_NODEJS_BACKEND_URL=https://your-nodejs-backend.com
NEXT_PUBLIC_DEFAULT_BACKEND=python
NEXT_PUBLIC_WS_URL=wss://your-websocket-domain.com
```

### Deployment Steps

1. **Prepare your backend services**:
   - Deploy your Python, Go, or Node.js backend to a hosting service (Heroku, AWS, Google Cloud, etc.)
   - Make sure your backend is accessible via HTTPS in production

2. **Configure environment variables**:
   - In your Vercel dashboard, go to your project settings
   - Add the environment variables listed above with your actual backend URLs

3. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect this as a Next.js project
   - The build command will be `cd frontend && npm run build`
   - Output directory will be `frontend/out`

### Backend Deployment Options

You can deploy any of the three backend implementations:

#### Python (FastAPI)
- Deploy to Heroku, Railway, or any Python-compatible platform
- Make sure CORS is configured to allow your Vercel domain

#### Go (Gin)
- Deploy as a Docker container or compile binary
- Host on platforms like DigitalOcean, AWS, or Google Cloud

#### Node.js (NestJS)
- Deploy to Heroku, Railway, or any Node.js-compatible platform
- Configure environment variables for database connections

### Important Notes

- The frontend will connect to your backend services via API calls
- All backend switching functionality remains intact
- Health check page will show the status of your deployed backends
- Authentication and all features work as expected
- Make sure your backend services are secured with HTTPS in production

### Sample Vercel Configuration

The project includes a vercel.json file that configures the deployment properly:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/next.config.js",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### Testing Before Deployment

Before deploying to Vercel, test your configuration locally:

```bash
# Set environment variables
export NEXT_PUBLIC_PYTHON_BACKEND_URL=https://your-python-backend.com
export NEXT_PUBLIC_GO_BACKEND_URL=https://your-go-backend.com
export NEXT_PUBLIC_NODEJS_BACKEND_URL=https://your-nodejs-backend.com

# Run the application
cd frontend
npm run dev
```

### Troubleshooting

If you experience issues after deployment:

1. Check browser console for CORS errors
2. Verify that your backend URLs are accessible
3. Ensure your backend has proper CORS configuration
4. Check that authentication tokens are being passed correctly
5. Verify that the backend selector is working properly

### Production Best Practices

- Use HTTPS for all backend connections
- Implement proper error handling
- Set up monitoring for your backend services
- Configure proper authentication and authorization
- Use environment-specific configurations
- Implement rate limiting on your backend
- Set up proper logging and monitoring