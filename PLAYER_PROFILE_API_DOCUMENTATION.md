# 🏏 Player Profile API Documentation

## Base URL
```
Production: https://cricket-d5rd.onrender.com/api
Development: http://localhost:1337/api
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 👤 Player Profile API Endpoints

### 1. Create Complete Player Profile
**POST** `/player-profiles`

Create a comprehensive player profile with all cricket data in one API call.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "data": {
    "displayName": "Virat Kohli",
    "age": 35,
    "birthday": "1988-11-05",
    "role": "Batsman",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "skillLevel": "Professional",
    "location": "Delhi, India",
    "bio": "Professional cricket player and former captain of the Indian national team.",
    "isAvailable": true,
    "rating": 4.9,
    "totalMatches": 254,
    "phoneNumber": "+91-9876543210",
    "emergencyContact": "+91-9876543211",
    "user": 7,
    "stats": {
      "matchesPlayed": 254,
      "runsScored": 12169,
      "highestScore": 183,
      "average": 58.18,
      "strikeRate": 93.17,
      "centuries": 43,
      "halfCenturies": 64,
      "wicketsTaken": 4,
      "bowlingAverage": 166.25,
      "economyRate": 6.25,
      "bestBowling": "1/15",
      "catches": 137,
      "stumpings": 0,
      "runOuts": 15
    },
    "achievements": [
      {
        "title": "ICC ODI Player of the Year",
        "description": "Awarded for outstanding performance in ODI cricket",
        "achievedDate": "2017-12-15",
        "category": "batting",
        "points": 100
      },
      {
        "title": "Fastest to 10000 ODI runs",
        "description": "Reached 10000 ODI runs in just 205 innings",
        "achievedDate": "2018-10-24",
        "category": "milestone",
        "points": 150
      }
    ]
  }
}
```

**Field Descriptions:**

**Basic Information:**
- `displayName` (string, required): Player's display name
- `age` (integer): Age between 10-80
- `birthday` (date): Date of birth
- `role` (enum, required): Player role
  - `Batsman`
  - `Bowler`
  - `All-rounder`
  - `Wicket-keeper`
  - `Captain`
- `battingStyle` (enum): Batting style
  - `Right-handed`
  - `Left-handed`
- `bowlingStyle` (enum): Bowling style
  - `Right-arm fast`
  - `Left-arm fast`
  - `Right-arm medium`
  - `Left-arm medium`
  - `Right-arm spin`
  - `Left-arm spin`
  - `Leg-spin`
  - `Off-spin`
- `skillLevel` (enum): Skill level
  - `Beginner`
  - `Intermediate`
  - `Advanced`
  - `Professional`
- `location` (string): Player's location
- `bio` (text): Player biography
- `isAvailable` (boolean): Availability status
- `rating` (decimal): Rating out of 5.0
- `totalMatches` (integer): Total matches played
- `phoneNumber` (string): Contact number
- `emergencyContact` (string): Emergency contact

**Cricket Statistics:**
- `matchesPlayed` (integer): Total matches
- `runsScored` (integer): Total runs
- `highestScore` (integer): Highest individual score
- `average` (decimal): Batting average
- `strikeRate` (decimal): Strike rate
- `centuries` (integer): Number of centuries
- `halfCenturies` (integer): Number of half-centuries
- `wicketsTaken` (integer): Total wickets
- `bowlingAverage` (decimal): Bowling average
- `economyRate` (decimal): Economy rate
- `bestBowling` (string): Best bowling figures
- `catches` (integer): Number of catches
- `stumpings` (integer): Number of stumpings
- `runOuts` (integer): Number of run-outs

**Achievements:**
- `title` (string, required): Achievement title
- `description` (text): Achievement description
- `achievedDate` (date): Date achieved
- `category` (enum): Achievement category
  - `batting`
  - `bowling`
  - `fielding`
  - `team`
  - `tournament`
  - `milestone`
- `points` (integer): Points awarded

**Response (201):**
```json
{
  "data": {
    "id": 10,
    "documentId": "abc123def456",
    "displayName": "Virat Kohli",
    "age": 35,
    "birthday": "1988-11-05",
    "role": "Batsman",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "skillLevel": "Professional",
    "location": "Delhi, India",
    "bio": "Professional cricket player and former captain of the Indian national team.",
    "profileImageUrl": null,
    "isAvailable": true,
    "rating": 4.9,
    "totalMatches": 254,
    "phoneNumber": "+91-9876543210",
    "emergencyContact": "+91-9876543211",
    "user": {
      "id": 7,
      "username": "virat_kohli",
      "email": "virat@example.com"
    },
    "stats": {
      "matchesPlayed": 254,
      "runsScored": 12169,
      "highestScore": 183,
      "average": 58.18,
      "strikeRate": 93.17,
      "centuries": 43,
      "halfCenturies": 64,
      "wicketsTaken": 4,
      "bowlingAverage": 166.25,
      "economyRate": 6.25,
      "bestBowling": "1/15",
      "catches": 137,
      "stumpings": 0,
      "runOuts": 15
    },
    "achievements": [
      {
        "id": 1,
        "title": "ICC ODI Player of the Year",
        "description": "Awarded for outstanding performance in ODI cricket",
        "achievedDate": "2017-12-15",
        "category": "batting",
        "points": 100,
        "badgeUrl": null
      },
      {
        "id": 2,
        "title": "Fastest to 10000 ODI runs",
        "description": "Reached 10000 ODI runs in just 205 innings",
        "achievedDate": "2018-10-24",
        "category": "milestone",
        "points": 150,
        "badgeUrl": null
      }
    ],
    "createdAt": "2025-11-01T10:30:00.000Z",
    "updatedAt": "2025-11-01T10:30:00.000Z",
    "publishedAt": "2025-11-01T10:30:00.000Z"
  },
  "meta": {
    "message": "Player profile created successfully"
  }
}
```

---

### 2. Get All Player Profiles (Complete Data)
**GET** `/player-profiles`

Retrieve all player profiles with complete data in a single API call.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `pageSize` (number, optional): Profiles per page (default: 25, max: 50)

**Example Request:**
```
GET /api/player-profiles?page=1&pageSize=25
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 10,
      "documentId": "abc123def456",
      "displayName": "Virat Kohli",
      "age": 35,
      "role": "Batsman",
      "location": "Delhi, India",
      "rating": 4.9,
      "totalMatches": 254,
      "isAvailable": true,
      "user": {
        "id": 7,
        "username": "virat_kohli",
        "email": "virat@example.com"
      },
      "stats": {
        "matchesPlayed": 254,
        "runsScored": 12169,
        "average": 58.18,
        "centuries": 43,
        "wicketsTaken": 4,
        "catches": 137
      },
      "achievements": [
        {
          "title": "ICC ODI Player of the Year",
          "category": "batting",
          "points": 100
        }
      ],
      "createdAt": "2025-11-01T10:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### 3. Get Single Player Profile (Complete Data)
**GET** `/player-profiles/:documentId`

Retrieve a complete player profile with all data in one API call.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Example Request:**
```
GET /api/player-profiles/abc123def456
```

**Response (200):**
```json
{
  "data": {
    "id": 10,
    "documentId": "abc123def456",
    "displayName": "Virat Kohli",
    "age": 35,
    "birthday": "1988-11-05",
    "role": "Batsman",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "skillLevel": "Professional",
    "location": "Delhi, India",
    "bio": "Professional cricket player and former captain of the Indian national team.",
    "profileImageUrl": "https://cricket-d5rd.onrender.com/uploads/virat_profile.jpg",
    "isAvailable": true,
    "rating": 4.9,
    "totalMatches": 254,
    "phoneNumber": "+91-9876543210",
    "emergencyContact": "+91-9876543211",
    "user": {
      "id": 7,
      "username": "virat_kohli",
      "email": "virat@example.com"
    },
    "stats": {
      "matchesPlayed": 254,
      "runsScored": 12169,
      "highestScore": 183,
      "average": 58.18,
      "strikeRate": 93.17,
      "centuries": 43,
      "halfCenturies": 64,
      "wicketsTaken": 4,
      "bowlingAverage": 166.25,
      "economyRate": 6.25,
      "bestBowling": "1/15",
      "catches": 137,
      "stumpings": 0,
      "runOuts": 15
    },
    "achievements": [
      {
        "id": 1,
        "title": "ICC ODI Player of the Year",
        "description": "Awarded for outstanding performance in ODI cricket",
        "achievedDate": "2017-12-15",
        "category": "batting",
        "points": 100,
        "badgeUrl": "https://cricket-d5rd.onrender.com/uploads/icc_award_badge.png"
      },
      {
        "id": 2,
        "title": "Fastest to 10000 ODI runs",
        "description": "Reached 10000 ODI runs in just 205 innings",
        "achievedDate": "2018-10-24",
        "category": "milestone",
        "points": 150,
        "badgeUrl": null
      }
    ],
    "createdAt": "2025-11-01T10:30:00.000Z",
    "updatedAt": "2025-11-01T10:30:00.000Z",
    "publishedAt": "2025-11-01T10:30:00.000Z"
  },
  "meta": {
    "message": "Player profile retrieved successfully"
  }
}
```

---

### 4. Update Player Profile
**PUT** `/player-profiles/:documentId`

Update player profile with complete data.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "data": {
    "bio": "Updated: Professional cricket player, former captain, and one of the greatest batsmen.",
    "rating": 5.0,
    "totalMatches": 260,
    "stats": {
      "matchesPlayed": 260,
      "runsScored": 12500,
      "average": 58.50,
      "centuries": 45
    }
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": 10,
    "documentId": "abc123def456",
    "displayName": "Virat Kohli",
    "bio": "Updated: Professional cricket player, former captain, and one of the greatest batsmen.",
    "rating": 5.0,
    "totalMatches": 260,
    "stats": {
      "matchesPlayed": 260,
      "runsScored": 12500,
      "average": 58.50,
      "centuries": 45
    },
    "updatedAt": "2025-11-01T11:00:00.000Z"
  },
  "meta": {
    "message": "Player profile updated successfully"
  }
}
```

---

### 5. Delete Player Profile
**DELETE** `/player-profiles/:documentId`

Delete a player profile.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Example Request:**
```
DELETE /api/player-profiles/abc123def456
```

**Response (200):**
```json
{
  "data": {
    "message": "Player profile deleted successfully",
    "id": "abc123def456"
  }
}
```

---

### 6. Get Player Profile by User ID
**GET** `/player-profiles/user/:userId`

Get player profile for a specific user.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Example Request:**
```
GET /api/player-profiles/user/7
```

**Response (200):**
```json
{
  "data": {
    "id": 10,
    "documentId": "abc123def456",
    "displayName": "Virat Kohli",
    "user": {
      "id": 7,
      "username": "virat_kohli",
      "email": "virat@example.com"
    },
    "stats": {
      "runsScored": 12169,
      "average": 58.18,
      "centuries": 43
    },
    "achievements": [
      {
        "title": "ICC ODI Player of the Year",
        "category": "batting"
      }
    ]
  },
  "meta": {
    "message": "Player profile retrieved successfully"
  }
}
```

---

### 7. Search Player Profiles
**GET** `/player-profiles/search`

Search player profiles by various criteria.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Query Parameters:**
- `query` (string, optional): Search in name, bio, location
- `role` (string, optional): Filter by role (Batsman, Bowler, etc.)
- `skillLevel` (string, optional): Filter by skill level
- `location` (string, optional): Filter by location

**Example Request:**
```
GET /api/player-profiles/search?role=Batsman&skillLevel=Professional&location=India
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 10,
      "documentId": "abc123def456",
      "displayName": "Virat Kohli",
      "role": "Batsman",
      "skillLevel": "Professional",
      "location": "Delhi, India",
      "rating": 4.9,
      "stats": {
        "runsScored": 12169,
        "average": 58.18,
        "centuries": 43
      },
      "achievements": [
        {
          "title": "ICC ODI Player of the Year",
          "category": "batting"
        }
      ]
    }
  ],
  "meta": {
    "total": 1,
    "message": "Search completed successfully"
  }
}
```

---

## 📊 Player Roles & Categories

### Player Roles
- `Batsman` - Specialist batsman
- `Bowler` - Specialist bowler
- `All-rounder` - Both batting and bowling
- `Wicket-keeper` - Wicket-keeper batsman
- `Captain` - Team captain

### Skill Levels
- `Beginner` - New to cricket
- `Intermediate` - Some experience
- `Advanced` - Experienced player
- `Professional` - Professional level

### Achievement Categories
- `batting` - Batting achievements
- `bowling` - Bowling achievements
- `fielding` - Fielding achievements
- `team` - Team achievements
- `tournament` - Tournament wins
- `milestone` - Career milestones

---

## ❌ Error Responses

### 400 Bad Request - Missing Required Fields
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Display name and role are required"
  }
}
```

### 404 Not Found - Profile Not Found
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Player profile not found"
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Authentication required"
  }
}
```

---

## 🚀 Usage Examples

### Create Complete Profile
```bash
curl -X POST https://cricket-d5rd.onrender.com/api/player-profiles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "displayName": "MS Dhoni",
      "age": 42,
      "role": "Wicket-keeper",
      "skillLevel": "Professional",
      "location": "Ranchi, India",
      "rating": 4.8,
      "stats": {
        "matchesPlayed": 350,
        "runsScored": 10773,
        "average": 50.57,
        "catches": 256,
        "stumpings": 38
      },
      "achievements": [
        {
          "title": "World Cup Winner",
          "description": "Led India to 2011 World Cup victory",
          "category": "team",
          "points": 200
        }
      ]
    }
  }'
```

### Get Complete Profile
```bash
curl -X GET https://cricket-d5rd.onrender.com/api/player-profiles/abc123def456 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Search Profiles
```bash
curl -X GET "https://cricket-d5rd.onrender.com/api/player-profiles/search?role=Batsman&skillLevel=Professional" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 Key Features

### ✅ Single API Call Benefits:
- **Complete Data**: All profile info, stats, achievements, and user data in one response
- **Performance**: No need for multiple API calls
- **Consistency**: All related data retrieved together
- **Efficiency**: Reduced network requests and faster loading

### ✅ Comprehensive Profile Data:
- **Personal Information**: Name, age, contact details, bio
- **Cricket Details**: Role, batting/bowling style, skill level
- **Complete Statistics**: All batting, bowling, and fielding stats
- **Achievements**: Categorized achievements with points and badges
- **User Integration**: Linked user account information
- **Media Support**: Profile images and achievement badges

### ✅ Production Features:
- **Deployed**: https://cricket-d5rd.onrender.com
- **Database**: PostgreSQL with proper relations
- **Validation**: Comprehensive input validation
- **Security**: JWT authentication and authorization
- **Performance**: Optimized queries and caching
- **Error Handling**: Proper error responses and logging

---

Your comprehensive player profile API is production-ready! 🏏👤