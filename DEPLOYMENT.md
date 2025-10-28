# Render Deployment Checklist

## Pre-deployment Setup

### 1. Environment Variables
Generate secure values for these environment variables in Render:

```
NODE_ENV=production
HOST=0.0.0.0
PORT=10000
DATABASE_CLIENT=postgres
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Generate secure random strings for these:
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-random-string-32-chars
ADMIN_JWT_SECRET=your-jwt-secret-32-chars
TRANSFER_TOKEN_SALT=your-transfer-salt-32-chars
JWT_SECRET=your-jwt-secret-32-chars
ENCRYPTION_KEY=your-encryption-key-32-chars

# Will be set automatically by Render PostgreSQL service:
DATABASE_URL=postgresql://username:password@host:port/database
```

### 2. Database Setup
- Create a PostgreSQL service on Render
- Note the internal database URL (will be automatically provided)

### 3. Web Service Configuration
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment: Node
- Plan: Starter (or higher based on needs)

## Deployment Steps

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Create PostgreSQL Service**: 
   - Go to Render Dashboard
   - Create new PostgreSQL service
   - Choose appropriate plan
3. **Create Web Service**:
   - Connect GitHub repository
   - Use the `render.yaml` configuration or manual setup
   - Set environment variables
   - Deploy

## Post-deployment

1. **Access Admin Panel**: Visit `https://your-app-name.onrender.com/admin`
2. **Create Admin User**: Follow the setup wizard
3. **Test API Endpoints**: Verify all content types are working
4. **Configure CORS**: Update CORS settings if needed for frontend integration

## Troubleshooting

- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure PostgreSQL service is running
- Check database connection in logs

## Performance Optimization

- Enable gzip compression
- Configure CDN for media files
- Set up proper caching headers
- Monitor database performance