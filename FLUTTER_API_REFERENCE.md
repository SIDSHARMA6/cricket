# 🏏 Cricket API Reference for Flutter

**Base URL**: `https://cricket-d5rd.onrender.com/api`

## 📋 Table of Contents
1. [🔐 Authentication](#-authentication)
2. [🏏 Matches](#-matches)
3. [👥 Teams](#-teams)
4. [🏆 Tournaments](#-tournaments)
5. [👤 Player Profiles](#-player-profiles)
6. [💬 Community Chat](#-community-chat)
7. [📖 Stories](#-stories)
8. [📝 Posts](#-posts)
9. [📊 Scorecards](#-scorecards)
10. [🔔 Notifications](#-notifications)
11. [📊 Polls](#-polls)
12. [🗳️ Poll Responses](#️-poll-responses)
13. [✅ Match Responses](#-match-responses)
14. [🔍 Health Check](#-health-check)

---

## 🔐 Authentication

### Register User
**POST** `/auth/local/register`

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "confirmed": true,
    "blocked": false
  }
}
```

### Login User
**POST** `/auth/local`

**Request:**
```json
{
  "identifier": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Get Current User
**GET** `/users/me`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "confirmed": true,
  "blocked": false
}
```

---

## 🏏 Matches

### Get All Matches
**GET** `/matches`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Weekend Cricket Match",
      "groundName": "Central Park Ground",
      "groundAddress": "123 Park Street",
      "entryFee": 100.00,
      "prizePool": 1000.00,
      "schedule": "2025-10-30T14:00:00.000Z",
      "endTime": "2025-10-30T18:00:00.000Z",
      "totalPlayersNeeded": 22,
      "playersJoined": 8,
      "matchType": "T20",
      "status": "upcoming",
      "description": "Friendly T20 match",
      "isPrivate": false,
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Get Single Match
**GET** `/matches/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "Weekend Cricket Match",
    "groundName": "Central Park Ground",
    "schedule": "2025-10-30T14:00:00.000Z",
    "totalPlayersNeeded": 22,
    "playersJoined": 8,
    "matchType": "T20",
    "status": "upcoming"
  }
}
```

### Create Match
**POST** `/matches`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "title": "Weekend Cricket Match",
    "groundName": "Central Park Ground",
    "groundAddress": "123 Park Street",
    "entryFee": 100.00,
    "prizePool": 1000.00,
    "schedule": "2025-10-30T14:00:00.000Z",
    "endTime": "2025-10-30T18:00:00.000Z",
    "totalPlayersNeeded": 22,
    "matchType": "T20",
    "description": "Friendly T20 match",
    "isPrivate": false
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "Weekend Cricket Match",
    "groundName": "Central Park Ground",
    "schedule": "2025-10-30T14:00:00.000Z",
    "totalPlayersNeeded": 22,
    "matchType": "T20",
    "status": "upcoming"
  }
}
```

### Update Match
**PUT** `/matches/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "title": "Updated Match Title",
    "status": "ongoing"
  }
}
```

### Delete Match
**DELETE** `/matches/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

---

## 👥 Teams

### Get All Teams
**GET** `/teams`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Thunder Bolts",
      "shortName": "TB",
      "homeGround": "City Stadium",
      "description": "Professional cricket team",
      "isActive": true,
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Get Single Team
**GET** `/teams/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Thunder Bolts",
    "shortName": "TB",
    "homeGround": "City Stadium",
    "description": "Professional cricket team",
    "isActive": true
  }
}
```

### Create Team
**POST** `/teams`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "name": "Thunder Bolts",
    "shortName": "TB",
    "homeGround": "City Stadium",
    "description": "Professional cricket team",
    "isActive": true
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Thunder Bolts",
    "shortName": "TB",
    "homeGround": "City Stadium",
    "description": "Professional cricket team",
    "isActive": true
  }
}
```

### Update Team
**PUT** `/teams/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "name": "Updated Team Name",
    "description": "Updated description"
  }
}
```

### Delete Team
**DELETE** `/teams/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

---

## 🏆 Tournaments

### Get All Tournaments
**GET** `/tournaments`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "City Cricket Championship",
      "startDate": "2025-11-01T00:00:00.000Z",
      "endDate": "2025-11-15T00:00:00.000Z",
      "entryFee": 500.00,
      "prizePool": 10000.00,
      "maxTeams": 16,
      "tournamentType": "League",
      "status": "registration_open",
      "location": "City Sports Complex"
    }
  ]
}
```

### Create Tournament
**POST** `/tournaments`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "name": "City Cricket Championship",
    "description": "Annual cricket tournament",
    "startDate": "2025-11-01T00:00:00.000Z",
    "endDate": "2025-11-15T00:00:00.000Z",
    "registrationDeadline": "2025-10-25T00:00:00.000Z",
    "entryFee": 500.00,
    "prizePool": 10000.00,
    "maxTeams": 16,
    "tournamentType": "League",
    "location": "City Sports Complex"
  }
}
```

---

## 👤 Player Profiles

### Get All Player Profiles
**GET** `/player-profiles`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "displayName": "John Doe",
      "age": 25,
      "role": "Batsman",
      "battingStyle": "Right-handed",
      "bowlingStyle": "Right-arm medium",
      "skillLevel": "Intermediate",
      "location": "New York",
      "bio": "Passionate cricket player",
      "isAvailable": true,
      "rating": 4.2,
      "totalMatches": 15
    }
  ]
}
```

### Create Player Profile
**POST** `/player-profiles`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
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
    "location": "New York",
    "bio": "Passionate cricket player",
    "phoneNumber": "+1234567890",
    "emergencyContact": "+1234567891"
  }
}
```

---

## 💬 Community Chat

### Get All Messages
**GET** `/chats`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "message": "Hey everyone! Ready for tomorrow's match?",
      "messageType": "text",
      "isEdited": false,
      "isDeleted": false,
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Send Message
**POST** `/chats`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "message": "Great match today! Well played everyone 🏏",
    "messageType": "text"
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "message": "Great match today! Well played everyone 🏏",
    "messageType": "text",
    "isEdited": false,
    "isDeleted": false,
    "createdAt": "2025-10-28T10:00:00.000Z"
  }
}
```

### Update Message
**PUT** `/chats/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "message": "Updated message content",
    "isEdited": true
  }
}
```

### Delete Message
**DELETE** `/chats/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

---

## 📖 Stories

### Get All Stories
**GET** `/stories`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Amazing Six!",
      "content": "Check out this incredible six from today's match!",
      "storyType": "highlight",
      "views": 25,
      "isPublic": true,
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Create Story
**POST** `/stories`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "title": "Amazing Six!",
    "content": "Check out this incredible six from today's match!",
    "storyType": "highlight",
    "isPublic": true
  }
}
```

---

## 📝 Posts

### Get All Posts
**GET** `/posts`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "caption": "Great practice session today! 🏏",
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Create Post
**POST** `/posts`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "caption": "Great practice session today! 🏏"
  }
}
```

---

## 📊 Scorecards

### Get All Scorecards
**GET** `/scorecards`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "tossDecision": "bat",
      "winMargin": "5 wickets",
      "weather": "Sunny",
      "pitchCondition": "Good",
      "matchSummary": "Great match with excellent batting performance"
    }
  ]
}
```

### Create Scorecard
**POST** `/scorecards`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "tossDecision": "bat",
    "winMargin": "5 wickets",
    "weather": "Sunny",
    "pitchCondition": "Good",
    "matchSummary": "Great match with excellent batting performance"
  }
}
```

---

## 🔔 Notifications

### Get All Notifications
**GET** `/notifications`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Match Reminder",
      "message": "Your match starts in 1 hour!",
      "type": "match_reminder",
      "isRead": false,
      "priority": "high",
      "actionUrl": "/matches/1",
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Create Notification
**POST** `/notifications`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "title": "Match Reminder",
    "message": "Your match starts in 1 hour!",
    "type": "match_reminder",
    "priority": "high",
    "actionUrl": "/matches/1"
  }
}
```

---

## � Pollts

### Get All Polls
**GET** `/polls`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "question": "Who will win the next match?",
      "description": "Vote for your favorite team",
      "options": [
        {"id": 1, "text": "Team A", "votes": 15},
        {"id": 2, "text": "Team B", "votes": 12},
        {"id": 3, "text": "Draw", "votes": 3}
      ],
      "isActive": true,
      "allowMultipleVotes": false,
      "expiresAt": "2025-11-01T00:00:00.000Z",
      "totalVotes": 30,
      "isAnonymous": false,
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Get Single Poll
**GET** `/polls/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "data": {
    "id": 1,
    "question": "Who will win the next match?",
    "description": "Vote for your favorite team",
    "options": [
      {"id": 1, "text": "Team A", "votes": 15},
      {"id": 2, "text": "Team B", "votes": 12},
      {"id": 3, "text": "Draw", "votes": 3}
    ],
    "isActive": true,
    "allowMultipleVotes": false,
    "totalVotes": 30,
    "isAnonymous": false
  }
}
```

### Create Poll
**POST** `/polls`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "question": "Who will win the next match?",
    "description": "Vote for your favorite team",
    "options": [
      {"id": 1, "text": "Team A", "votes": 0},
      {"id": 2, "text": "Team B", "votes": 0},
      {"id": 3, "text": "Draw", "votes": 0}
    ],
    "allowMultipleVotes": false,
    "expiresAt": "2025-11-01T00:00:00.000Z",
    "isAnonymous": false
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "question": "Who will win the next match?",
    "options": [
      {"id": 1, "text": "Team A", "votes": 0},
      {"id": 2, "text": "Team B", "votes": 0},
      {"id": 3, "text": "Draw", "votes": 0}
    ],
    "isActive": true,
    "totalVotes": 0
  }
}
```

### Update Poll
**PUT** `/polls/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "question": "Updated poll question?",
    "isActive": false
  }
}
```

### Delete Poll
**DELETE** `/polls/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

---

## 🗳️ Poll Responses

### Get Poll Responses
**GET** `/poll-responses`

**Headers:** `Authorization: Bearer {jwt_token}`

**Query Parameters:** `?filters[poll][id]={poll_id}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "selectedOptions": [1],
      "comment": "Team A has better players",
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Submit Poll Response
**POST** `/poll-responses`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "poll": 1,
    "selectedOptions": [1],
    "comment": "Team A has better players"
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "selectedOptions": [1],
    "comment": "Team A has better players",
    "createdAt": "2025-10-28T10:00:00.000Z"
  }
}
```

### Update Poll Response
**PUT** `/poll-responses/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "selectedOptions": [2],
    "comment": "Changed my mind, Team B is stronger"
  }
}
```

### Delete Poll Response
**DELETE** `/poll-responses/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

---

## ✅ Match Responses

### Get Match Responses
**GET** `/match-responses`

**Headers:** `Authorization: Bearer {jwt_token}`

**Query Parameters:** `?filters[match][id]={match_id}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "response": "available",
      "message": "I'll be there on time!",
      "responseDate": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Submit Match Response
**POST** `/match-responses`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "match": 1,
    "response": "available",
    "message": "I'll be there on time!"
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "response": "available",
    "message": "I'll be there on time!",
    "responseDate": "2025-10-28T10:00:00.000Z"
  }
}
```

### Update Match Response
**PUT** `/match-responses/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

**Request:**
```json
{
  "data": {
    "response": "not_available",
    "message": "Sorry, can't make it anymore"
  }
}
```

### Delete Match Response
**DELETE** `/match-responses/{id}`

**Headers:** `Authorization: Bearer {jwt_token}`

---

## 🔍 Health Check

### Check API Health
**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-28T10:10:42.848Z",
  "uptime": 886.363656312,
  "environment": "production"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Validation failed",
    "details": {}
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
    "message": "Missing or invalid credentials"
  }
}
```

### 403 Forbidden
```json
{
  "data": null,
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "Forbidden"
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
    "message": "Not Found"
  }
}
```

---

## 📱 Flutter Integration Notes

1. **Base URL**: Use `https://cricket-d5rd.onrender.com/api` for production
2. **Authentication**: Include `Authorization: Bearer {jwt_token}` header for protected endpoints
3. **Content-Type**: Always use `application/json` for requests
4. **Error Handling**: Check `error` field in response for error details
5. **Pagination**: Most list endpoints support `page` and `pageSize` query parameters