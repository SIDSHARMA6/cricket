# Cloudinary Setup for Strapi on Render.com

## Why This is Needed
Render.com uses **ephemeral storage** - any files uploaded to the local filesystem are deleted when the server restarts. This is why your images return 404 errors.

## Quick Setup (5 minutes)

### 1. Create Free Cloudinary Account
1. Go to https://cloudinary.com/users/register_free
2. Sign up (free tier includes 25GB storage + 25GB bandwidth/month)
3. After signup, go to Dashboard

### 2. Get Your Credentials
On the Cloudinary Dashboard, you'll see:
- **Cloud Name**: `dxxxxxxxx`
- **API Key**: `123456789012345`
- **API Secret**: `abcdefghijklmnopqrstuvwxyz`

### 3. Add to Render.com Environment Variables
1. Go to your Render.com dashboard
2. Select your Strapi service
3. Go to **Environment** tab
4. Add these three variables:
   ```
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   ```
5. Click **Save Changes**

### 4. Deploy
Render will automatically redeploy with the new configuration.

## What Changed
✅ Installed `@strapi/provider-upload-cloudinary`
✅ Configured `config/plugins.ts` to use Cloudinary
✅ Added environment variables to `.env.example`

## Testing
After deployment:
1. Upload an image in your Flutter app
2. The image will be stored on Cloudinary
3. The URL will look like: `https://res.cloudinary.com/your_cloud_name/image/upload/...`
4. Images will persist across server restarts ✅

## Alternative: AWS S3
If you prefer AWS S3:
```bash
npm install @strapi/provider-upload-aws-s3
```

Then configure in `config/plugins.ts`:
```typescript
upload: {
  config: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      region: env('AWS_REGION'),
      params: {
        Bucket: env('AWS_BUCKET'),
      },
    },
  },
}
```

## Your App is Already Perfect! 🎉
Your Flutter app is working correctly. Once you configure Cloudinary on the server, images will load immediately.
