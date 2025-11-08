# Player Profile Update Issue - Fixed

## Problem
The player profile update API was returning a 500 Internal Server Error on the Render production server when trying to update profiles. The error occurred because:

```
[StrapiService] Update user response status: 500
[StrapiService] Update user response body: {"data":null,"error":{"status":500,"name":"InternalServerError","message":"Internal Server Error"}}
```

## Root Cause
The mobile app was sending a `favoriteTeam` field in the update request:

```json
{
  "displayName": "anil",
  "bio": "hlo I am batsmen",
  "age": 25,
  "birthday": "2000-08-08",
  "location": "hisar",
  "phoneNumber": "8930899260",
  "emergencyContact": "",
  "role": "Batsman",
  "battingStyle": "Left-handed",
  "bowlingStyle": "Right-arm medium",
  "skillLevel": "Beginner",
  "favoriteTeam": "india",  // <-- This field was not in the schema
  "isAvailable": true
}
```

However, the `favoriteTeam` field was **not defined** in the Player Profile schema (`schema.json`), causing Strapi to reject the update with a 500 error.

## Solution Applied

### 1. Added `favoriteTeam` field to schema
**File:** `src/api/player-profile/content-types/player-profile/schema.json`

```json
{
  "favoriteTeam": {
    "type": "string"
  }
}
```

### 2. Updated controller to handle `favoriteTeam`
**File:** `src/api/player-profile/controllers/player-profile.ts`

- Added `favoriteTeam` to the transformation function
- Added `favoriteTeam` to the create method parameters
- Added `favoriteTeam` to the create data object
- Added detailed error logging for debugging

### 3. Enhanced error logging
Added console.log statements to track:
- Update requests with data
- Detailed error information (message, stack, details)

This will help identify similar issues in the future.

## Next Steps

### Deploy to Render
1. Commit these changes:
```bash
git add .
git commit -m "fix: add favoriteTeam field to player profile schema"
git push
```

2. Render will automatically redeploy the application

3. After deployment, the schema will be updated and the update endpoint will work correctly

### Test After Deployment
Once deployed, test the update endpoint:

```bash
# This should now work without 500 error
curl -X PUT https://cricket-1-zawr.onrender.com/api/player-profiles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "data": {
      "displayName": "anil",
      "favoriteTeam": "india",
      "bio": "hlo I am batsmen"
    }
  }'
```

## Why It Worked Locally But Not on Render

This is a common issue where:
1. Local development database might have had the field added manually through the admin panel
2. Or the local schema was out of sync with the committed code
3. Production (Render) uses the exact schema from the repository

Always ensure schema changes are committed to the repository!

## Additional Improvements Made

1. **Better error logging** - Now logs full error details for debugging
2. **Updated API documentation** - Added `favoriteTeam` field to the API docs
3. **Consistent field handling** - Field is now properly handled in create, update, and transform operations
