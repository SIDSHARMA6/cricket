# Coolify Deployment Guide

## Prerequisites
- Coolify instance running
- PostgreSQL database service in Coolify

## Deployment Steps

### 1. Create PostgreSQL Database in Coolify
1. Go to your Coolify dashboard
2. Create a new PostgreSQL database service
3. Note the connection details (Coolify will provide environment variables)

### 2. Create New Application
1. In Coolify, create a new application
2. Connect your Git repository
3. Select "Dockerfile" as build pack
4. Set port to `1337`

### 3. Configure Environment Variables
Add these environment variables in Coolify (use the `.env.example.coolify` as reference):

**Required Security Keys** (Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)
- `APP_KEYS` - 4 comma-separated keys
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `ENCRYPTION_KEY`
- `JWT_SECRET`

**Server Configuration**
- `HOST=0.0.0.0`
- `PORT=1337`
- `NODE_ENV=production`

**Database Configuration** (Coolify PostgreSQL provides these automatically)
- `DATABASE_CLIENT=postgres`
- `DATABASE_URL` - Use Coolify's PostgreSQL connection string
- `DATABASE_HOST` - From Coolify PostgreSQL service
- `DATABASE_PORT=5432`
- `DATABASE_NAME` - From Coolify PostgreSQL service
- `DATABASE_USERNAME` - From Coolify PostgreSQL service
- `DATABASE_PASSWORD` - From Coolify PostgreSQL service
- `DATABASE_SSL=false` (Coolify internal network doesn't need SSL)

**Optional - Cloudinary (for media uploads)**
- `CLOUDINARY_NAME`
- `CLOUDINARY_KEY`
- `CLOUDINARY_SECRET`

**Optional - CORS**
- `CORS_ORIGIN` - Your frontend URL

### 4. Link PostgreSQL Database
In Coolify, link your PostgreSQL database to your application. Coolify will automatically inject the database environment variables.

### 5. Deploy
1. Click "Deploy" in Coolify
2. Wait for the build to complete
3. Your Strapi app will be available at the provided URL

### 6. First Time Setup
1. Access your Strapi admin panel at `https://your-app-url/admin`
2. Create your first admin user
3. Configure your content types and permissions

## Important Notes

- **Database Persistence**: Coolify PostgreSQL data is persistent across deployments
- **File Uploads**: Consider using Cloudinary for production file uploads (already configured)
- **Secrets**: Never commit `.env` file with real credentials
- **Build Time**: First deployment may take 5-10 minutes due to npm install and build

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL service is running in Coolify
- Check that environment variables are correctly set
- Ensure `DATABASE_SSL=false` for Coolify internal network

### Build Failures
- Check Coolify build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (18.x)

### Admin Panel Not Loading
- Clear browser cache
- Check that `APP_KEYS` is properly set
- Verify build completed successfully

## Useful Commands

Generate secure keys:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Check logs in Coolify:
- Go to your application → Logs tab
