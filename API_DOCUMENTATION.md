# 🏏 Crinect API Documentation

**Base URL:** `http://localhost:1337/api`  
**Production URL:** `https://your-domain.com/api`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Users & Profile](#users--profile)
3. [Posts](#posts)
4. [Comments](#comments)
5. [Polls](#polls)
6. [Matches](#matches)
7. [Groups](#groups)
8. [Direct Messages](#direct-messages)
9. [Teams](#teams)
10. [Tournaments](#tournaments)
11. [Achievements](#achievements)
12. [Reports](#reports)
13. [Error Handling](#error-handling)

---

## 🔐 Authentication

### Register
```http
POST /auth/local/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123"
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

### Login
```http
POST /auth/local
Content-Type: application/json

{
  "identifier": "john@example.com",
  "password": "Password123"
}
```

**Response:** Same as register

### Get Current User
```http
GET /users/me
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "latitude": 29.1492,
  "longitude": 75.7217,
  "city": "Hisar",
  "state": "Haryana",
  "district": "Hisar",
  "country": "India",
  "phone": "+91-9876543210",
  "profileImage": "https://cloudinary.com/...",
  "bio": "Cricket enthusiast",
  "followers_count": 10,
  "following_count": 15
}
```

---

## 👤 Users & Profile

### Update Profile (Including Location)
```http
PUT /users/{id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "username": "john_doe",
  "phone": "+91-9876543210",
  "bio": "Love playing cricket!",
  "latitude": 29.1492,
  "longitude": 75.7217,
  "city": "Hisar",
  "state": "Haryana",
  "district": "Hisar",
  "profileImage": "https://cloudinary.com/..."
}
```

### Get All Users (For Nearby Calculation)
```http
GET /users
Authorization: Bearer {jwt_token}
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "latitude": 29.1492,
    "longitude": 75.7217,
    "city": "Hisar",
    "state": "Haryana",
    "profileImage": "https://...",
    "bio": "Cricket enthusiast"
  }
]
```

**Flutter: Calculate Distance**
```dart
// Haversine formula
double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
  const R = 6371; // Earth radius in km
  final dLat = (lat2 - lat1) * pi / 180;
  final dLon = (lon2 - lon1) * pi / 180;
  
  final a = sin(dLat/2) * sin(dLat/2) +
            cos(lat1 * pi / 180) * cos(lat2 * pi / 180) *
            sin(dLon/2) * sin(dLon/2);
  
  final c = 2 * atan2(sqrt(a), sqrt(1-a));
  return R * c;
}

// Usage
final users = await api.getUsers();
final nearbyUsers = users.where((user) {
  final distance = calculateDistance(
    myLat, myLng,
    user.latitude, user.longitude
  );
  return distance <= 10; // 10km radius
}).toList();
```

### Follow User
```http
PUT /users/{currentUserId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "following": [1, 5, 8, 12]  // Array of user IDs
}
```

### Get User's Followers
```http
GET /users/{id}?populate=followers
Authorization: Bearer {jwt_token}
```

### Get User's Following
```http
GET /users/{id}?populate=following
Authorization: Bearer {jwt_token}
```

---

## 📝 Posts

### Create Post
```http
POST /posts
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "caption": "Great match today! 🏏",
    "visibility": "public"
  }
}
```

### Get All Posts
```http
GET /posts?populate=user,liked_by
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "caption": "Great match today! 🏏",
      "user": {
        "id": 1,
        "username": "john_doe"
      },
      "likeCount": 10,
      "commentCount": 5,
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

### Get Single Post
```http
GET /posts/{documentId}?populate=user,liked_by,comments
Authorization: Bearer {jwt_token}
```

### Update Post
```http
PUT /posts/{documentId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "caption": "Updated caption"
  }
}
```

### Delete Post
```http
DELETE /posts/{documentId}
Authorization: Bearer {jwt_token}
```

---

## 💬 Comments

### Create Comment
```http
POST /comments
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "text": "Great post!",
    "post": "post_documentId"
  }
}
```

### Get Comments for Post
```http
GET /comments?filters[post][documentId][$eq]=post_documentId&populate=user
Authorization: Bearer {jwt_token}
```

### Update Comment
```http
PUT /comments/{documentId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "text": "Updated comment"
  }
}
```

### Delete Comment
```http
DELETE /comments/{documentId}
Authorization: Bearer {jwt_token}
```

---

## 📊 Polls

### Create Poll
```http
POST /polls
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "question": "Who's free for cricket this Sunday?",
    "options": ["Morning", "Afternoon", "Evening"],
    "isActive": true
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "documentId": "poll123",
    "question": "Who's free for cricket this Sunday?",
    "options": ["Morning", "Afternoon", "Evening"],
    "votes": [],
    "isActive": true,
    "user": {
      "id": 1,
      "username": "john_doe"
    }
  }
}
```

### Get All Polls
```http
GET /polls?populate=user
Authorization: Bearer {jwt_token}
```

### Vote on Poll (Manual Implementation)
```http
PUT /polls/{documentId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "votes": [
      {"userId": 1, "username": "john_doe", "optionIndex": 0},
      {"userId": 5, "username": "jane_smith", "optionIndex": 1}
    ]
  }
}
```

### Delete Poll
```http
DELETE /polls/{documentId}
Authorization: Bearer {jwt_token}
```

---

## 🏏 Matches

### Create Match
```http
POST /matches
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "ground_name": "City Stadium",
    "date_time": "2024-01-25T10:00:00.000Z",
    "total_Players_need": 22,
    "latitude": 29.1492,
    "longitude": 75.7217,
    "city": "Hisar",
    "state": "Haryana",
    "match_type": "friendly",
    "format": "T20",
    "overs": 20,
    "status": "upcoming",
    "entry_fee": 100,
    "description": "Friendly T20 match"
  }
}
```

### Get All Matches
```http
GET /matches?populate=user,players
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "match123",
      "ground_name": "City Stadium",
      "date_time": "2024-01-25T10:00:00.000Z",
      "total_Players_need": 22,
      "latitude": 29.1492,
      "longitude": 75.7217,
      "city": "Hisar",
      "state": "Haryana",
      "user": {
        "id": 1,
        "username": "john_doe"
      },
      "players": [
        {"id": 1, "username": "john_doe"},
        {"id": 5, "username": "jane_smith"}
      ],
      "match_type": "friendly",
      "format": "T20",
      "status": "upcoming"
    }
  ]
}
```

### Get Nearby Matches (Flutter)
```dart
// Get all matches and filter by distance
final matches = await api.getMatches();
final nearbyMatches = matches.where((match) {
  if (match.latitude == null || match.longitude == null) return false;
  
  final distance = calculateDistance(
    myLat, myLng,
    match.latitude, match.longitude
  );
  return distance <= 20; // 20km radius
}).toList();

// Sort by distance
nearbyMatches.sort((a, b) {
  final distA = calculateDistance(myLat, myLng, a.latitude, a.longitude);
  final distB = calculateDistance(myLat, myLng, b.latitude, b.longitude);
  return distA.compareTo(distB);
});
```

### Update Match
```http
PUT /matches/{documentId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "status": "live"
  }
}
```

### Delete Match
```http
DELETE /matches/{documentId}
Authorization: Bearer {jwt_token}
```

---

## 👥 Groups

### Create Group
```http
POST /groups
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "name": "Hisar Cricket Club",
    "description": "Local cricket enthusiasts",
    "type": "public"
  }
}
```

### Get All Groups
```http
GET /groups?populate=user,members
Authorization: Bearer {jwt_token}
```

### Join Group ⭐ Custom Endpoint
```http
POST /groups/{documentId}/join
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "documentId": "group123",
    "name": "Hisar Cricket Club",
    "members_count": 5,
    "members": [
      {"id": 1, "username": "john_doe"},
      {"id": 5, "username": "jane_smith"}
    ]
  },
  "message": "Joined group successfully"
}
```

### Leave Group ⭐ Custom Endpoint
```http
POST /groups/{documentId}/leave
Authorization: Bearer {jwt_token}
```

### Update Group
```http
PUT /groups/{documentId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "description": "Updated description"
  }
}
```

### Delete Group
```http
DELETE /groups/{documentId}
Authorization: Bearer {jwt_token}
```

---

## 💬 Direct Messages

### Send Direct Message
```http
POST /direct-messages
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "message": "Hey, want to play cricket this weekend?",
    "receiver": 5
  }
}
```

### Get My Messages
```http
GET /direct-messages?populate=sender,receiver
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "msg123",
      "message": "Hey, want to play cricket this weekend?",
      "sender": {
        "id": 1,
        "username": "john_doe"
      },
      "receiver": {
        "id": 5,
        "username": "jane_smith"
      },
      "read": false,
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

### Get Conversation with User
```http
GET /direct-messages?filters[$or][0][sender][id][$eq]=5&filters[$or][0][receiver][id][$eq]=5&populate=sender,receiver
Authorization: Bearer {jwt_token}
```

### Mark as Read
```http
PUT /direct-messages/{documentId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "read": true
  }
}
```

### Delete Message
```http
DELETE /direct-messages/{documentId}
Authorization: Bearer {jwt_token}
```

---

## 🏆 Teams

### Create Team
```http
POST /teams
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "name": "Hisar Warriors",
    "city": "Hisar",
    "state": "Haryana"
  }
}
```

### Get All Teams
```http
GET /teams?populate=captain,players
Authorization: Bearer {jwt_token}
```

### Update Team
```http
PUT /teams/{documentId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "wins": 5,
    "losses": 2
  }
}
```

---

## 🏅 Tournaments

### Create Tournament
```http
POST /tournaments
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "name": "Hisar Premier League 2024",
    "start_date": "2024-02-01",
    "format": "knockout",
    "city": "Hisar",
    "state": "Haryana"
  }
}
```

### Get All Tournaments
```http
GET /tournaments?populate=organizer,teams
Authorization: Bearer {jwt_token}
```

---

## 🎖️ Achievements

### Get All Achievements
```http
GET /achievements
Authorization: Bearer {jwt_token}
```

### Get User's Achievements
```http
GET /achievements?filters[users][id][$eq]={userId}
Authorization: Bearer {jwt_token}
```

---

## 🚨 Reports

### Create Report
```http
POST /reports
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "data": {
    "reason": "Inappropriate content",
    "description": "This post contains offensive language"
  }
}
```

### Get My Reports
```http
GET /reports?populate=reporter
Authorization: Bearer {jwt_token}
```

---

## ❌ Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Missing or invalid credentials"
  }
}
```

**403 Forbidden**
```json
{
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "You can only delete your own posts"
  }
}
```

**404 Not Found**
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Post not found"
  }
}
```

**400 Bad Request**
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid data provided"
  }
}
```

---

## 🔍 Query Parameters

### Pagination
```http
GET /posts?pagination[page]=1&pagination[pageSize]=10
```

### Sorting
```http
GET /posts?sort=createdAt:desc
```

### Filtering
```http
GET /posts?filters[user][id][$eq]=1
GET /matches?filters[city][$eq]=Hisar
GET /matches?filters[date_time][$gte]=2024-01-20
```

### Population
```http
GET /posts?populate=user,liked_by,comments
GET /matches?populate[user][fields][0]=username&populate[players][fields][0]=username
```

---

## 📱 Flutter Example

```dart
class CrinectAPI {
  final String baseUrl = 'http://localhost:1337/api';
  String? _token;
  
  // Set token after login
  void setToken(String token) {
    _token = token;
  }
  
  // Get headers with auth
  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };
  
  // Register
  Future<Map<String, dynamic>> register(String username, String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/local/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setToken(data['jwt']);
      return data;
    }
    throw Exception('Registration failed');
  }
  
  // Update location
  Future<void> updateLocation(int userId, double lat, double lng, String city, String state) async {
    await http.put(
      Uri.parse('$baseUrl/users/$userId'),
      headers: _headers,
      body: jsonEncode({
        'latitude': lat,
        'longitude': lng,
        'city': city,
        'state': state,
      }),
    );
  }
  
  // Get nearby users
  Future<List<User>> getNearbyUsers(double myLat, double myLng, double radius) async {
    final response = await http.get(
      Uri.parse('$baseUrl/users'),
      headers: _headers,
    );
    
    final List users = jsonDecode(response.body);
    return users
        .map((u) => User.fromJson(u))
        .where((user) {
          if (user.latitude == null || user.longitude == null) return false;
          final distance = calculateDistance(myLat, myLng, user.latitude!, user.longitude!);
          return distance <= radius;
        })
        .toList();
  }
  
  // Join group
  Future<void> joinGroup(String groupId) async {
    await http.post(
      Uri.parse('$baseUrl/groups/$groupId/join'),
      headers: _headers,
    );
  }
}
```

---

## 🎯 Summary

- All endpoints use standard REST conventions
- Authentication via JWT token in Authorization header
- Use `documentId` for all operations (not numeric `id`)
- Location features calculated in Flutter
- Group join/leave are custom endpoints
- Everything else uses default Strapi CRUD

**Happy coding! 🚀**
