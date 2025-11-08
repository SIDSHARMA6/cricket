# Deployment Checklist for Render

## ✅ Fixed Issues

1. **Root URL Redirect** - Added redirect from `/` to `/admin` in `src/index.ts`
2. **Hardcoded URLs Removed** - All URLs now use environment variables
3. **Production Admin Config** - Added missing `secrets.encryptionKey`
4. **Start Script** - Fixed to work cross-platform

## 🔴 Critical: Environment Variables in Render Dashboard

Go to: https://dashboard.render.com → Your Service → Environment Tab

### Required Variables (MUST BE SET):

```bash
# Security Keys - Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
APP_KEYS=<key1>,<key2>
ADMIN_JWT_SECRET=<secret>
API_TOKEN_SALT=<salt>
TRANSFER_TOKEN_SALT=<salt>
JWT_SECRET=<secret>
ENCRYPTION_KEY=<key>

# Database - Should be auto-filled by Render PostgreSQL
DATABASE_URL=<postgres-connection-string>
DATABASE_HOST=<host>
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=<password>

# URLs
PUBLIC_URL=https://cricket-1-zawr.onrender.com
PUBLIC_ADMIN_URL=https://cricket-1-zawr.onrender.com/admin

# Already set in render.yaml
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
HOST=0.0.0.0
PORT=10000
```

## 🔧 How to Generate Secure Keys

Run this command 6 times to generate all required keys:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📝 Deployment Steps

1. **Set Environment Variables** in Render Dashboard (see above)
2. **Commit Changes**:
   ```bash
   git add .
   git commit -m "Fix: Add root redirect and production config"
   git push
   ```
3. **Wait for Deployment** - Render will auto-deploy
4. **Check Logs** in Render Dashboard for any errors
5. **Access Admin**: https://cricket-1-zawr.onrender.com

## 🐛 Troubleshooting "isFirstSuperAdminUser" Error

This error means Strapi cannot initialize the admin user table. Causes:

1. **Missing Environment Variables** - Check all keys are set
2. **Database Connection Failed** - Verify DATABASE_URL is correct
3. **Database Not Initialized** - May need to clear and rebuild

### Solution:
1. Verify all environment variables are set in Render
2. Check Render logs for database connection errors
3. If needed, delete and recreate the PostgreSQL service
4. Redeploy after setting all variables

## ✅ Verification

After deployment, test:
- [ ] https://cricket-1-zawr.onrender.com → Redirects to /admin
- [ ] https://cricket-1-zawr.onrender.com/admin → Shows admin login
- [ ] Can create first admin user
- [ ] Can login successfully

## 📊 Current Status

- ✅ Root URL redirects to /admin
- ✅ Admin panel URL responds (200 OK)
- ⚠️ Database initialization error (needs env vars)
