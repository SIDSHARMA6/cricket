 Fix Render URL Redirection Issue

## Problem
When visiting `https://cricket-d5rd.onrender.com`, it redirects to `http://localhost:1337/admin`

## Solution
Add these environment variables in your Render dashboard:

### Go to Render Dashboard
1. Open your web service: `cricket-strapi-api`
2. Go to **Environment** tab
3. Add these new environment variables:

```
PUBLIC_URL=https://cricket-d5rd.onrender.com
PUBLIC_ADMIN_URL=https://cricket-d5rd.onrender.com/admin
```

### After Adding Variables
1. Click **Save Changes**
2. Your service will automatically redeploy
3. Wait for deployment to complete (5-10 minutes)

## Test After Fix
- **Main URL**: https://cricket-d5rd.onrender.com (should show Strapi welcome)
- **Admin Panel**: https://cricket-d5rd.onrender.com/admin (should open admin)
- **API Health**: https://cricket-d5rd.onrender.com/api/health (should return status)

## Alternative Quick Fix
If you can't access Render dashboard, the URLs should work correctly after the next deployment since we've updated the code to use the correct defaults.

The issue was that Strapi was using `http://localhost:1337` as the default PUBLIC_URL instead of your actual Render URL.