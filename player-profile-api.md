# Player Profile API - Complete CRUD Documentation

## Base URLs
```
Local:  http://localhost:1337/api/player-profiles
Render: https://cricket-1-zawr.onrender.com/api/player-profiles
```

## Authentication
Most endpoints require authentication. Include JWT token in headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Complete Request Body Structure

### Create Player Profile (POST)

```json
{
  "data": {
    "displayName": "John Doe",
    "age": 25,
    "birthday": "1999-05-15",
    "role": "Batsman",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "skillLevel": "Intermediate",
    "location": "Mumbai, India",
    "bio": "Passionate cricket player with 5 years of experience",
    "isAvailable": true,
    "rating": 4.5,
    "totalMatches": 45,
    "phoneNumber": "+91-9876543210",
    "emergencyContact": "+91-9876543211",
    "favoriteTeam": "India",
    "stats": {
      "matchesPlayed": 45,
      "runsScored": 1250,
      "highestScore": 89,
      "average": 32.5,
      "strikeRate": 125.5,
      "centuries": 0,
      "halfCenturies": 8,
      "wicketsTaken": 12,
      "bowlingAverage": 28.5,
      "economyRate": 6.5,
      "bestBowling": "3/25",
      "catches": 15,
      "stumpings": 0,
      "runOuts": 3
    },
    "achievements": [
      {
        "title": "Best Batsman Award",
        "description": "Best batsman of the season",
        "achievedDate": "2024-03-15",
        "category": "batting",
        "points": 100
      }
    ]
  }
}
```

## Field Descriptions

### Basic Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `displayName` | string | Yes | Player's display name |
| `age` | number | No | Player's age |
| `birthday` | string | No | Date of birth (YYYY-MM-DD) |
| `role` | string | Yes | Player role (Batsman, Bowler, All-rounder, Wicket-keeper) |
| `battingStyle` | string | No | Batting style (Right-handed, Left-handed) |
| `bowlingStyle` | string | No | Bowling style (Right-arm fast, Left-arm spin, etc.) |
| `skillLevel` | string | No | Skill level (Beginner, Intermediate, Advanced, Professional) |
| `location` | string | No | Player's location |
| `bio` | string | No | Player biography |
| `isAvailable` | boolean | No | Availability status (default: true) |
| `rating` | number | No | Player rating (0-5) |
| `totalMatches` | number | No | Total matches played |
| `phoneNumber` | string | No | Contact phone number |
| `emergencyContact` | string | No | Emergency contact number |
| `favoriteTeam` | string | No | Player's favorite cricket team |

### Stats Object
| Field | Type | Description |
|-------|------|-------------|
| `matchesPlayed` | number | Total matches played |
| `runsScored` | number | Total runs scored |
| `highestScore` | number | Highest individual score |
| `average` | number | Batting average |
| `strikeRate` | number | Strike rate |
| `centuries` | number | Number of centuries (100+ runs) |
| `halfCenturies` | number | Number of half-centuries (50-99 runs) |
| `wicketsTaken` | number | Total wickets taken |
| `bowlingAverage` | number | Bowling average |
| `economyRate` | number | Economy rate |
| `bestBowling` | string | Best bowling figures (e.g., "5/32") |
| `catches` | number | Number of catches |
| `stumpings` | number | Number of stumpings |
| `runOuts` | number | Number of run-outs |

### Achievements Array
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Achievement title |
| `description` | string | Achievement description |
| `achievedDate` | string | Date achieved (YYYY-MM-DD) |
| `category` | string | Category (batting, bowling, fielding, team, milestone, tournament) |
| `points` | number | Points awarded |

---

## CRUD Operations

### 1. CREATE - Create Player Profile

**Endpoint:** `POST /api/player-profiles`

**Authentication:** Required

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "data": {
    "displayName": "Kiro Test User",
    "age": 25,
    "birthday": "1999-05-15",
    "role": "Batsman",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "skillLevel": "Intermediate",
    "location": "Mumbai, India",
    "bio": "Passionate cricket player",
    "profileImageUrl": "https://kiro.dev/icon.svg?fe599162bb293ea0",
    "isAvailable": true,
    "rating": 4.5,
    "totalMatches": 45,
    "phoneNumber": "+91-9876543210",
    "emergencyContact": "+91-9876543211",
    "favoriteTeam": "India",
    "stats": {
      "matchesPlayed": 45,
      "runsScored": 1250,
      "highestScore": 89,
      "average": 32.5,
      "strikeRate": 125.5,
      "centuries": 0,
      "halfCenturies": 8,
      "wicketsTaken": 12,
      "bowlingAverage": 28.5,
      "economyRate": 6.5,
      "bestBowling": "3/25",
      "catches": 15,
      "stumpings": 0,
      "runOuts": 3
    },
    "achievements": [
      {
        "title": "Best Batsman Award",
        "description": "Best batsman of the season",
        "achievedDate": "2024-03-15",
        "category": "batting",
        "points": 100
      }
    ]
  }
}
```

**Success Response (201):**
```json
{
  "data": {
    "id": 12,
    "documentId": "abc123xyz",
    "displayName": "Kiro Test User",
    "age": 25,
    "birthday": "1999-05-15",
    "role": "Batsman",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "skillLevel": "Intermediate",
    "location": "Mumbai, India",
    "bio": "Passionate cricket player",
    "profileImageUrl": "https://kiro.dev/icon.svg?fe599162bb293ea0",
    "isAvailable": true,
    "rating": 4.5,
    "totalMatches": 45,
    "phoneNumber": "+91-9876543210",
    "emergencyContact": "+91-9876543211",
    "favoriteTeam": "India",
    "user": {
      "id": 8,
      "username": "kirotest",
      "email": "kirotest@test.com"
    },
    "stats": {
      "matchesPlayed": 45,
      "runsScored": 1250,
      "highestScore": 89,
      "average": 32.5,
      "strikeRate": 125.5,
      "centuries": 0,
      "halfCenturies": 8,
      "wicketsTaken": 12,
      "bowlingAverage": 28.5,
      "economyRate": 6.5,
      "bestBowling": "3/25",
      "catches": 15,
      "stumpings": 0,
      "runOuts": 3
    },
    "achievements": [
      {
        "id": 1,
        "title": "Best Batsman Award",
        "description": "Best batsman of the season",
        "achievedDate": "2024-03-15",
        "category": "batting",
        "points": 100,
        "badge": null,
        "badgeUrl": null
      }
    ],
    "createdAt": "2025-11-10T10:22:15.123Z",
    "updatedAt": "2025-11-10T10:22:15.123Z",
    "publishedAt": null
  },
  "meta": {
    "message": "Player profile created successfully"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:1337/api/player-profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d @profile-create.json
```

**PowerShell Example:**
```powershell
$token = "YOUR_JWT_TOKEN"
$body = Get-Content profile-create.json -Raw
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
Invoke-WebRequest -Uri "http://localhost:1337/api/player-profiles" `
  -Method POST -Body $body -Headers $headers
```

---

### 2. READ - Get All Player Profiles

**Endpoint:** `GET /api/player-profiles`

**Authentication:** Not Required (Public)

**Query Parameters:**
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10, max: 50)

**Success Response (200):**
```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 1,
      "total": 4
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:1337/api/player-profiles?page=1&pageSize=10"
```

**PowerShell Example:**
```powershell
Invoke-WebRequest -Uri "http://localhost:1337/api/player-profiles?page=1&pageSize=10" -Method GET
```

---

### 3. READ - Get Single Player Profile

**Endpoint:** `GET /api/player-profiles/:id`

**Authentication:** Not Required (Public)

**Success Response (200):**
```json
{
  "data": {
    "id": 9,
    "documentId": "gepg44fcdnk3p5z1j3068cts",
    "displayName": "Rohit Sharma",
    "age": 36,
    "birthday": "1987-04-30",
    "role": "Batsman",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "skillLevel": "Professional",
    "location": "Mumbai, India",
    "bio": "Indian cricket team captain...",
    "profileImageUrl": null,
    "isAvailable": true,
    "rating": 4.7,
    "totalMatches": 243,
    "phoneNumber": "+91-9876543216",
    "emergencyContact": "+91-9876543217",
    "user": {
      "id": 7,
      "username": "testuser123",
      "email": "testuser123@example.com"
    },
    "stats": {...},
    "achievements": [...],
    "createdAt": "2025-11-01T05:13:04.428Z",
    "updatedAt": "2025-11-01T05:13:04.428Z",
    "publishedAt": null
  },
  "meta": {
    "message": "Player profile retrieved successfully"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:1337/api/player-profiles/12
```

**PowerShell Example:**
```powershell
Invoke-WebRequest -Uri "http://localhost:1337/api/player-profiles/12" -Method GET
```

---

### 4. UPDATE - Update Player Profile

**Endpoint:** `PUT /api/player-profiles/:id`

**Authentication:** Required

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body (All fields optional):**
```json
{
  "data": {
    "displayName": "Updated Name",
    "profileImageUrl": "https://new-image-url.com/image.jpg",
    "bio": "Updated bio",
    "rating": 4.8,
    "stats": {
      "matchesPlayed": 50,
      "runsScored": 1500
    }
  }
}
```

**Success Response (200):**
```json
{
  "data": {
    "id": 12,
    "documentId": "abc123xyz",
    "displayName": "Updated Name",
    "profileImageUrl": "https://new-image-url.com/image.jpg",
    "bio": "Updated bio",
    "rating": 4.8,
    ...
  },
  "meta": {
    "message": "Player profile updated successfully"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:1337/api/player-profiles/12 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"data": {"displayName": "Updated Name"}}'
```

**PowerShell Example:**
```powershell
$token = "YOUR_JWT_TOKEN"
$body = '{"data": {"displayName": "Updated Name", "profileImageUrl": "https://new-url.com/image.jpg"}}'
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
Invoke-WebRequest -Uri "http://localhost:1337/api/player-profiles/12" `
  -Method PUT -Body $body -Headers $headers
```

---

### 5. DELETE - Delete Player Profile

**Endpoint:** `DELETE /api/player-profiles/:id`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "data": {
    "message": "Player profile deleted successfully",
    "id": "9"
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:1337/api/player-profiles/12 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**PowerShell Example:**
```powershell
$token = "YOUR_JWT_TOKEN"
$headers = @{"Authorization" = "Bearer $token"}
Invoke-WebRequest -Uri "http://localhost:1337/api/player-profiles/12" `
  -Method DELETE -Headers $headers
```

---

## Additional Endpoints

### 6. Get Player Profile by User ID

**Endpoint:** `GET /api/player-profiles/user/:userId`

**Authentication:** Not Required (Public)

**Success Response (200):** Same as single profile

**cURL Example:**
```bash
curl -X GET http://localhost:1337/api/player-profiles/user/8
```

---

### 7. Search Player Profiles

**Endpoint:** `GET /api/player-profiles/search`

**Authentication:** Not Required (Public)

**Query Parameters:**
- `query` - Search text (searches in displayName, bio, location)
- `role` - Filter by role
- `skillLevel` - Filter by skill level
- `location` - Filter by location (partial match)

**Success Response (200):**
```json
{
  "data": [...],
  "meta": {
    "total": 2,
    "message": "Search completed successfully"
  }
}
```

## Example cURL Commands

### Get All Profiles
```bash
curl -X GET http://localhost:1337/api/player-profiles
```

### Get Single Profile
```bash
curl -X GET http://localhost:1337/api/player-profiles/9
```

### Create Profile (with authentication)
```bash
curl -X POST http://localhost:1337/api/player-profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d @player-profile-body.json
```

### Search Profiles
```bash
curl -X GET "http://localhost:1337/api/player-profiles/search?role=Batsman&skillLevel=Professional"
```

## PowerShell Examples

### Get All Profiles
```powershell
Invoke-WebRequest -Uri "http://localhost:1337/api/player-profiles" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Create Profile
```powershell
$body = Get-Content player-profile-body.json -Raw
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
}
Invoke-WebRequest -Uri "http://localhost:1337/api/player-profiles" -Method POST -Body $body -Headers $headers
```

### Search Profiles
```powershell
Invoke-WebRequest -Uri "http://localhost:1337/api/player-profiles/search?query=Mumbai" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

## Error Responses

### 400 Bad Request
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequest",
    "message": "Display name and role are required"
  }
}
```

### 401 Unauthorized
```json
{
  "data": null,
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "You must be logged in to perform this action"
  }
}
```

### 404 Not Found
```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Player profile not found"
  }
}
```

### 500 Server Error
```json
{
  "data": null,
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Failed to fetch player profiles"
  }
}
```

## Notes

- Authentication is required for POST, PUT, and DELETE operations
- GET operations are publicly accessible
- The `user` field is automatically set to the authenticated user if not provided
- Default `skillLevel` is "Beginner" if not specified
- Default `isAvailable` is true if not specified
- Default `rating` is 0 if not specified
- Profile images can be uploaded separately and linked via `profileImage` field
- All stats fields default to 0 if not provided
- Profile images are stored in Cloudinary and returned as full URLs
- The API automatically handles both local uploads and Cloudinary URLs

## Render Deployment Configuration

The following environment variables must be set in Render dashboard:

### Required Cloudinary Variables
```
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

### Required Strapi Secrets
```
APP_KEYS=your_app_keys_comma_separated
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret
```

These are configured in `render.yaml` with `sync: false` to be set manually in Render dashboard.
