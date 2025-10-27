# API Endpoints for Flutter Screens

## Screen 1: Home (Stories + Posts)

### Stories
- `GET /api/stories` - Get recent stories (filtered for non-expired)
  ```js
  // Example query with filters
  /api/stories?filters[expiresAt][$gt]=2025-10-27&sort=createdAt:desc
  ```
- `POST /api/stories` - Create story (requires auth)
  - Body: { caption, media }
  - Media handled by Strapi upload

### Posts
- `GET /api/posts` - Get posts feed with pagination
  ```js
  // Example query with relations
  /api/posts?populate=author,media&sort=createdAt:desc&pagination[page]=1
  ```
- `POST /api/posts` - Create post (requires auth)
  - Body: { caption, media }

### Likes & Comments
- `POST /api/likes` - Like a post
  - Body: { post: id }
- `DELETE /api/likes/:id` - Unlike a post
- `GET /api/comments?filters[post][$eq]=123` - Get comments for post
- `POST /api/comments` - Add comment
  - Body: { content, post: id }

## Screen 2: Players List

### Players
- `GET /api/player-profiles` - List all players
  ```js
  // Example with user relation
  /api/player-profiles?populate=user,profile_image&pagination[page]=1
  ```
- `GET /api/player-profiles/:id` - Get single player profile

## Screen 3: Match Schedule

### Matches
- `GET /api/matches` - List upcoming matches
  ```js
  // Example filtering future matches
  /api/matches?filters[match_time][$gt]=2025-10-27&sort=match_time:asc
  ```
- `POST /api/matches` - Create match (requires auth)
  - Body: { title, ground_name, match_time, total_money, max_players }
- `PUT /api/matches/:id` - Update match details
- `POST /api/matches/:id/interested` - Mark interest in match
  ```js
  // Add to interested array
  PUT /api/matches/:id
  { "interested": { "connect": [userId] } }
  ```

## Screen 4: Community Chat

### Chat Messages
- Socket.IO events:
  - Connect with JWT in handshake auth
  - Listen on 'message' event
  - Emit 'message' with { content, channel: 'global' }

REST endpoints for history:
- `GET /api/chats` - Get chat history
  ```js
  // Example query for global chat
  /api/chats?filters[channel][$eq]=global&sort=createdAt:desc&pagination[pageSize]=50
  ```

## Screen 5: Player Profile

### Profile Management
- `GET /api/player-profiles/:id` - Get profile
- `PUT /api/player-profiles/:id` - Update profile
  - Body: { role, battingStyle, bowlingStyle, location, stats, availability }
- `PUT /api/upload` - Update profile image
  - Multipart form with files

## Authentication (Used by all screens)

### Auth endpoints
- `POST /api/auth/local/register` - Register new user
  ```js
  {
    "username": "player1",
    "email": "player1@example.com",
    "password": "password123"
  }
  ```
- `POST /api/auth/local` - Login
  ```js
  {
    "identifier": "player1@example.com",
    "password": "password123"
  }
  ```

## Media Upload (Used by Posts, Stories, Chat)

### Upload endpoints
- `POST /api/upload` - Upload media files
  - Multipart form with files
  - Returns file objects to reference in posts/stories

## Environment Variables Needed for Render

```bash
# Required
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2
API_TOKEN_SALT=salt
ADMIN_JWT_SECRET=secret
JWT_SECRET=secret
TRANSFER_TOKEN_SALT=salt
ENCRYPTION_KEY=key

# Media Upload (Cloudinary)
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_KEY=your-api-key
CLOUDINARY_SECRET=your-api-secret

# Optional for chat scaling
REDIS_URL=redis://your-redis-url

# CORS (set to your Flutter app origin)
CORS_ORIGIN=*
```

## Implementation Notes

1. Story expiry:
   - Set expiresAt = createdAt + 24h on create
   - Filter expired stories in queries

2. Chat implementation:
   - Uses Socket.IO with JWT auth
   - Messages persisted to chat collection
   - Global channel for community chat

3. Media handling:
   - Configure Cloudinary in plugins.ts
   - Upload media first, then reference in posts/stories

4. Player listing:
   - Populate user relation to get basic info
   - Can filter by role, availability, etc.

5. Match scheduling:
   - Use interested relation for player signup
   - Can add match status (open, full, completed)

## Testing the API

1. Start Strapi:
```bash
npm run develop
```

2. Create admin user at:
- http://localhost:1337/admin

3. Register a test user:
```bash
curl -X POST http://localhost:1337/api/auth/local/register \
-H 'Content-Type: application/json' \
-d '{"username": "player1", "email": "player1@example.com", "password": "password123"}'
```

4. Create player profile for the user
5. Test uploads and create some posts/stories
6. Test real-time chat