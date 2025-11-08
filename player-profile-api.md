# Player Profile API Documentation

## Base URL
```
http://localhost:1337/api/player-profiles
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

## API Endpoints

### 1. Get All Player Profiles
```
GET /api/player-profiles
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10, max: 50)

**Response:**
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

### 2. Get Single Player Profile
```
GET /api/player-profiles/:id
```

**Response:**
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

### 3. Create Player Profile
```
POST /api/player-profiles
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Body:** See "Complete Request Body Structure" above

**Response:**
```json
{
  "data": {...},
  "meta": {
    "message": "Player profile created successfully"
  }
}
```

### 4. Update Player Profile
```
PUT /api/player-profiles/:id
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Body:** Same as create, but all fields are optional

### 5. Delete Player Profile
```
DELETE /api/player-profiles/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "data": {
    "message": "Player profile deleted successfully",
    "id": "9"
  }
}
```

### 6. Get Player Profile by User ID
```
GET /api/player-profiles/user/:userId
```

**Response:** Same as single profile

### 7. Search Player Profiles
```
GET /api/player-profiles/search
```

**Query Parameters:**
- `query` - Search text (searches in displayName, bio, location)
- `role` - Filter by role
- `skillLevel` - Filter by skill level
- `location` - Filter by location (partial match)

**Example:**
```
GET /api/player-profiles/search?role=Batsman&skillLevel=Professional
GET /api/player-profiles/search?query=Mumbai
```

**Response:**
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
