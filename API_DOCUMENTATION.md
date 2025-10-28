# Cricket App API Documentation - Simplified

**Base URL**: `https://cricket-d5rd.onrender.com/api`

## Table of Contents
1. [Authentication](#authentication)
2. [Health Check](#health-check)
3. [Matches](#matches)
4. [Teams](#teams)
5. [Tournaments](#tournaments)
6. [Player Profiles](#player-profiles)
7. [Community Chat](#community-chat)
8. [Stories](#stories)
9. [Posts](#posts)
10. [Scorecards](#scorecards)
11. [Notifications](#notifications)

---

## Authentication

### Register User
**POST** `/auth/local/register`

**Body:**
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
    "blocked": false,
    "createdAt": "2025-10-28T10:00:00.000Z",
    "updatedAt": "2025-10-28T10:00:00.000Z"
  }
}
```

### Login User
**POST** `/auth/local`

**Body:**
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

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

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

## Health Check

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

## User Management

### Update User Profile
**PUT** `/users/{id}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
```json
{
  "username": "new_username",
  "email": "new@example.com"
}
```

---

## Matches

### Get All Matches
**GET** `/matches`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `populate`: Fields to populate (e.g., `players,organizer,matchImage`)
- `sort`: Sort order (e.g., `schedule:asc`)
- `filters`: Filter conditions

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Weekend Cricket Match",
      "groundName": "Central Park Ground",
      "groundAddress": "123 Park Street, City",
      "entryFee": 100.00,
      "prizePool": 1000.00,
      "schedule": "2025-10-30T14:00:00.000Z",
      "endTime": "2025-10-30T18:00:00.000Z",
      "totalPlayersNeeded": 22,
      "playersJoined": 8,
      "matchType": "T20",
      "status": "upcoming",
      "description": "Friendly T20 match for cricket enthusiasts",
      "isPrivate": false,
      "organizer": {
        "id": 1,
        "username": "organizer_user"
      },
      "players": [
        {
          "id": 2,
          "username": "player1"
        }
      ],
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
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

### Get Single Match
**GET** `/matches/{id}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
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
    "playersJoined": 8,
    "matchType": "T20",
    "status": "upcoming",
    "organizer": {
      "id": 1,
      "username": "organizer_user"
    },
    "players": []
  }
}
```

### Create Match
**POST** `/matches`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "data": {
    "title": "Weekend Cricket Match",
    "groundName": "Central Park Ground",
    "groundAddress": "123 Park Street, City",
    "entryFee": 100.00,
    "prizePool": 1000.00,
    "schedule": "2025-10-30T14:00:00.000Z",
    "endTime": "2025-10-30T18:00:00.000Z",
    "totalPlayersNeeded": 22,
    "matchType": "T20",
    "description": "Friendly T20 match for cricket enthusiasts",
    "rules": "Standard T20 rules apply",
    "isPrivate": false
  }
}
```

### Update Match
**PUT** `/matches/{id}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
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

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Teams

### Get All Teams
**GET** `/teams`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Thunder Bolts",
      "shortName": "TB",
      "captain": {
        "id": 1,
        "username": "captain_user"
      },
      "players": [],
      "isActive": true,
      "stats": {
        "matchesPlayed": 10,
        "matchesWon": 7,
        "winPercentage": 70.0
      }
    }
  ]
}
```

### Create Team
**POST** `/teams`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
```json
{
  "data": {
    "name": "Thunder Bolts",
    "shortName": "TB",
    "homeGround": "City Stadium",
    "description": "Professional cricket team",
    "colors": {
      "primary": "#FF0000",
      "secondary": "#FFFFFF"
    }
  }
}
```

### Update Team
**PUT** `/teams/{id}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
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

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Tournaments

### Get All Tournaments
**GET** `/tournaments`

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
      "organizer": {
        "id": 1,
        "username": "tournament_organizer"
      }
    }
  ]
}
```

### Create Tournament
**POST** `/tournaments`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
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

### Update Tournament
**PUT** `/tournaments/{id}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
```json
{
  "data": {
    "name": "Updated Tournament Name",
    "status": "ongoing"
  }
}
```

### Delete Tournament
**DELETE** `/tournaments/{id}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Player Profiles

### Get All Player Profiles
**GET** `/player-profiles`

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
      "totalMatches": 15,
      "stats": {
        "matchesPlayed": 15,
        "runsScored": 450,
        "highestScore": 85,
        "average": 32.14,
        "strikeRate": 125.5
      }
    }
  ]
}
```

### Create Player Profile
**POST** `/player-profiles`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
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
    "bio": "Passionate cricket player with 5 years experience",
    "phoneNumber": "+1234567890",
    "emergencyContact": "+1234567891"
  }
}
```

---

## Community Chat

### Get All Messages
**GET** `/chats`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `populate`: Fields to populate (e.g., `sender,replyTo`)
- `sort`: Sort order (e.g., `createdAt:desc`)
- `filters`: Filter conditions

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "message": "Hey everyone! Ready for tomorrow's match?",
      "messageType": "text",
      "sender": 1,
      "reactions": {
        "👍": [2, 3],
        "🔥": [4]
      },
      "isEdited": false,
      "isDeleted": false,
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Send Message
**POST** `/chats`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
```json
{
  "data": {
    "message": "Great match today! Well played everyone 🏏",
    "messageType": "text",
    "sender": 1
  }
}
```

### Update Message
**PUT** `/chats/{id}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
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

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Stories

### Get All Stories
**GET** `/stories`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Amazing Six!",
      "content": "Check out this incredible six from today's match!",
      "storyType": "highlight",
      "author": {
        "id": 1,
        "username": "john_doe"
      },
      "match": {
        "id": 1,
        "title": "Weekend Match"
      },
      "likes": [],
      "views": 25,
      "isPublic": true,
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Create Story
**POST** `/stories`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**
```json
{
  "data": {
    "title": "Amazing Six!",
    "content": "Check out this incredible six from today's match!",
    "storyType": "highlight",
    "match": 1,
    "tags": ["cricket", "six", "highlight"],
    "isPublic": true
  }
}
```

---

## Posts

### Get All Posts
**GET** `/posts`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "caption": "Great practice session today! 🏏",
      "post": [
        {
          "id": 1,
          "url": "/uploads/cricket_practice.jpg",
          "mime": "image/jpeg"
        }
      ],
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

### Create Post
**POST** `/posts`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (Form Data):**
```
caption: "Great practice session today! 🏏"
files.post: [image files]
```

---

## Scorecards

### Get All Scorecards
**GET** `/scorecards`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "match": {
        "id": 1,
        "title": "Weekend Match"
      },
      "teamA": {
        "id": 1,
        "name": "Thunder Bolts"
      },
      "teamB": {
        "id": 2,
        "name": "Lightning Strikes"
      },
      "tossWinner": {
        "id": 1,
        "name": "Thunder Bolts"
      },
      "tossDecision": "bat",
      "winner": {
        "id": 1,
        "name": "Thunder Bolts"
      },
      "winMargin": "5 wickets",
      "manOfTheMatch": {
        "id": 1,
        "username": "john_doe"
      }
    }
  ]
}
```

---

## Notifications

### Get User Notifications
**GET** `/notifications`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

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

### Mark Notification as Read
**POST** `/notifications/{id}/read`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Mark All Notifications as Read
**POST** `/notifications/read-all`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "path": ["title"],
          "message": "Title is required"
        }
      ]
    }
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

## Flutter Integration Tips

### 1. HTTP Client Setup
```dart
import 'package:dio/dio.dart';

class ApiClient {
  static const String baseUrl = 'https://cricket-d5rd.onrender.com/api';
  late Dio _dio;
  String? _token;

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: Duration(seconds: 30),
      receiveTimeout: Duration(seconds: 30),
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_token != null) {
          options.headers['Authorization'] = 'Bearer $_token';
        }
        handler.next(options);
      },
    ));
  }

  void setToken(String token) {
    _token = token;
  }
}
```

### 2. Authentication Service
```dart
class AuthService {
  final ApiClient _apiClient;

  AuthService(this._apiClient);

  Future<AuthResponse> login(String email, String password) async {
    final response = await _apiClient._dio.post('/auth/local', data: {
      'identifier': email,
      'password': password,
    });
    
    final authResponse = AuthResponse.fromJson(response.data);
    _apiClient.setToken(authResponse.jwt);
    return authResponse;
  }

  Future<AuthResponse> register(String username, String email, String password) async {
    final response = await _apiClient._dio.post('/auth/local/register', data: {
      'username': username,
      'email': email,
      'password': password,
    });
    
    final authResponse = AuthResponse.fromJson(response.data);
    _apiClient.setToken(authResponse.jwt);
    return authResponse;
  }
}
```

### 3. Model Classes
```dart
class Match {
  final int id;
  final String title;
  final String groundName;
  final DateTime schedule;
  final int totalPlayersNeeded;
  final int playersJoined;
  final String matchType;
  final String status;

  Match({
    required this.id,
    required this.title,
    required this.groundName,
    required this.schedule,
    required this.totalPlayersNeeded,
    required this.playersJoined,
    required this.matchType,
    required this.status,
  });

  factory Match.fromJson(Map<String, dynamic> json) {
    return Match(
      id: json['id'],
      title: json['title'],
      groundName: json['groundName'],
      schedule: DateTime.parse(json['schedule']),
      totalPlayersNeeded: json['totalPlayersNeeded'],
      playersJoined: json['playersJoined'],
      matchType: json['matchType'],
      status: json['status'],
    );
  }
}
```

### 4. File Upload Example
```dart
Future<void> uploadProfileImage(File imageFile) async {
  FormData formData = FormData.fromMap({
    'files': await MultipartFile.fromFile(
      imageFile.path,
      filename: 'profile.jpg',
    ),
  });

  await _apiClient._dio.post('/upload', data: formData);
}
```

### 5. Real-time Chat (WebSocket)
For real-time chat functionality, consider implementing WebSocket connection or use polling:

```dart
Timer.periodic(Duration(seconds: 2), (timer) {
  fetchLatestMessages();
});
```

---

## Rate Limiting
- The API has rate limiting in place
- Recommended: Implement exponential backoff for failed requests
- Cache responses when appropriate to reduce API calls

## Pagination
Most list endpoints support pagination:
- `page`: Page number (starts from 1)
- `pageSize`: Number of items per page (default: 25, max: 100)

## File Uploads
- Maximum file size: 10MB
- Supported formats: JPG, PNG, MP4, PDF
- Use multipart/form-data for file uploads