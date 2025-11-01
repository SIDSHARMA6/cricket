# Story Expiration API Documentation

## Overview
Stories automatically expire after 24 hours, just like Instagram stories. This feature includes automatic cleanup and filtering of expired content.

## Features
- ✅ **24-Hour Expiration**: Stories automatically expire 24 hours after creation
- ✅ **Automatic Cleanup**: Cron jobs clean up expired stories every hour
- ✅ **Real-time Status**: API shows time remaining until expiration
- ✅ **Filtering**: Get only active (non-expired) stories
- ✅ **Manual Cleanup**: Admin endpoint for manual cleanup

## API Endpoints

### 1. Create Story (with auto-expiration)
```http
POST /api/stories
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": {
    "story": [media_file_ids]
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "mediaUrls": ["https://..."],
    "likesCount": 0,
    "isLiked": false,
    "expiresAt": "2025-11-02T05:50:43.000Z",
    "isExpired": false,
    "timeRemaining": {
      "hours": 23,
      "minutes": 59,
      "totalMs": 86340000
    },
    "createdAt": "2025-11-01T05:50:43.000Z",
    "updatedAt": "2025-11-01T05:50:43.000Z"
  },
  "meta": {
    "message": "Story created successfully"
  }
}
```

### 2. Get All Stories (excludes expired by default)
```http
GET /api/stories?page=1&pageSize=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `includeExpired` (optional): Set to 'true' to include expired stories

### 3. Get Active Stories Only
```http
GET /api/stories/active?page=1&pageSize=10
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "mediaUrls": ["https://..."],
      "likesCount": 2,
      "isLiked": true,
      "expiresAt": "2025-11-02T05:50:43.000Z",
      "isExpired": false,
      "timeRemaining": {
        "hours": 12,
        "minutes": 30,
        "totalMs": 45000000
      },
      "createdAt": "2025-11-01T05:50:43.000Z",
      "updatedAt": "2025-11-01T05:50:43.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 1,
      "total": 1
    },
    "message": "Active stories only (expires within 24 hours)"
  }
}
```

### 4. Get Stories with Filters
```http
GET /api/stories/where?userId=1&liked=true&limit=10&offset=0
```

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `liked` (optional): Set to 'true' for stories liked by current user
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Skip results (default: 0)

### 5. Manual Cleanup Expired Stories (Admin)
```http
POST /api/stories/cleanup-expired
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "data": {
    "message": "5 expired stories cleaned up",
    "deletedIds": [1, 2, 3, 4, 5],
    "cleanupTime": "2025-11-01T06:00:00.000Z"
  }
}
```

### 6. Like/Unlike Story
```http
POST /api/stories/:id/like
Authorization: Bearer <token>
```

### 7. Bulk Delete Stories
```http
DELETE /api/stories/bulk-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

## Automatic Cleanup

### Cron Jobs
The system runs two automated tasks:

1. **Cleanup Expired Stories** (Every hour at minute 0)
   - Permanently deletes stories that have expired
   - Runs: `0 * * * *` (hourly)

2. **Mark Expired Stories** (Every 15 minutes)
   - Marks stories as expired without deleting them
   - Runs: `*/15 * * * *` (every 15 minutes)

### Environment Variables
```env
CRON_ENABLED=true  # Enable automatic cleanup (default: true)
```

## Story Lifecycle

1. **Creation**: Story is created with `expiresAt` set to 24 hours from now
2. **Active Period**: Story is visible and accessible for 24 hours
3. **Expiration**: After 24 hours, story is marked as expired
4. **Cleanup**: Expired stories are automatically deleted by cron job

## Time Remaining Calculation

Each story response includes a `timeRemaining` object:
```json
{
  "timeRemaining": {
    "hours": 12,        // Hours remaining
    "minutes": 30,      // Minutes remaining (within the current hour)
    "totalMs": 45000000 // Total milliseconds remaining
  }
}
```

## Error Handling

### Common Error Responses:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User can only modify their own stories
- `404 Not Found`: Story not found or expired
- `429 Too Many Requests`: Rate limit exceeded (max 5 stories per hour)

## Usage Examples

### Frontend Implementation
```javascript
// Check if story is about to expire (less than 1 hour remaining)
const isAboutToExpire = story.timeRemaining.totalMs < 3600000; // 1 hour in ms

// Show expiration warning
if (isAboutToExpire) {
  console.log(`Story expires in ${story.timeRemaining.hours}h ${story.timeRemaining.minutes}m`);
}

// Filter out expired stories on frontend (backup)
const activeStories = stories.filter(story => !story.isExpired);
```

### Mobile App Integration
```javascript
// Refresh stories periodically to get updated time remaining
setInterval(() => {
  fetchActiveStories();
}, 60000); // Every minute

// Show countdown timer
const formatTimeRemaining = (timeRemaining) => {
  if (timeRemaining.hours > 0) {
    return `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
  }
  return `${timeRemaining.minutes}m`;
};
```

## Best Practices

1. **Always use `/api/stories/active`** for user-facing story feeds
2. **Check `isExpired` flag** before displaying stories
3. **Implement countdown timers** using `timeRemaining` data
4. **Handle expired stories gracefully** in your UI
5. **Use pagination** for better performance with large story volumes

## Testing

### Test Story Expiration
```bash
# Create a story
curl -X POST "https://your-app.onrender.com/api/stories" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"data": {"story": [1]}}'

# Check active stories
curl -X GET "https://your-app.onrender.com/api/stories/active"

# Manual cleanup (admin only)
curl -X POST "https://your-app.onrender.com/api/stories/cleanup-expired" \
  -H "Authorization: Bearer <admin_token>"
```

The story expiration feature is now fully implemented and ready to use! 🎉