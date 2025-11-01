# 💬 WhatsApp-Style Community Chat API Documentation

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

## 📱 Chat API Endpoints

### 1. Send Message
**POST** `/chats`

Send a new message to the community chat.

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
    "message": "Hello cricket community! Ready for today's match? 🏏",
    "messageType": "text",
    "attachments": [],
    "replyTo": null,
    "mentions": [],
    "tags": ["cricket", "match"]
  }
}
```

**Request Body Fields:**
- `message` (string, required): Message content (max 2000 characters)
- `messageType` (enum, optional): Type of message
  - `text` (default)
  - `image`
  - `video`
  - `audio`
  - `file`
  - `match_invite`
  - `celebration`
- `attachments` (array, optional): Array of media IDs
- `replyTo` (number, optional): ID of message being replied to
- `mentions` (array, optional): Array of user IDs being mentioned
- `tags` (array, optional): Array of tags for categorization

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "message": "Hello cricket community! Ready for today's match? 🏏",
    "messageType": "text",
    "sender": {
      "id": 5,
      "username": "virat_kohli",
      "email": "virat@example.com"
    },
    "attachmentUrls": [],
    "replyTo": null,
    "reactions": {},
    "mentions": [],
    "isEdited": false,
    "editedAt": null,
    "isDeleted": false,
    "deletedAt": null,
    "tags": ["cricket", "match"],
    "createdAt": "2025-11-01T10:30:00.000Z",
    "updatedAt": "2025-11-01T10:30:00.000Z"
  },
  "meta": {
    "message": "Message created successfully"
  }
}
```

---

### 2. Get All Messages
**GET** `/chats`

Retrieve all community chat messages with pagination.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `pageSize` (number, optional): Messages per page (default: 50, max: 100)

**Example Request:**
```
GET /api/chats?page=1&pageSize=50
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 4,
      "message": "Great game today! Amazing performance! 👏",
      "messageType": "text",
      "sender": {
        "id": 10,
        "username": "ms_dhoni",
        "email": "dhoni@example.com"
      },
      "attachmentUrls": [],
      "replyTo": null,
      "reactions": {
        "👍": [5, 7, 12],
        "🔥": [8, 9]
      },
      "mentions": [
        {
          "id": 5,
          "username": "virat_kohli"
        }
      ],
      "isEdited": false,
      "editedAt": null,
      "isDeleted": false,
      "deletedAt": null,
      "tags": ["cricket", "celebration"],
      "createdAt": "2025-11-01T10:40:00.000Z",
      "updatedAt": "2025-11-01T10:40:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### 3. Get Single Message
**GET** `/chats/:id`

Retrieve a specific message by ID.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Example Request:**
```
GET /api/chats/1
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "message": "Hello cricket community! Ready for today's match? 🏏",
    "messageType": "text",
    "sender": {
      "id": 5,
      "username": "virat_kohli",
      "email": "virat@example.com"
    },
    "attachmentUrls": [],
    "replyTo": null,
    "reactions": {
      "👍": [7, 10, 12],
      "🏏": [8]
    },
    "mentions": [],
    "isEdited": false,
    "editedAt": null,
    "isDeleted": false,
    "deletedAt": null,
    "tags": ["cricket", "match"],
    "createdAt": "2025-11-01T10:30:00.000Z",
    "updatedAt": "2025-11-01T10:30:00.000Z"
  }
}
```

---

### 4. Edit Message
**PUT** `/chats/:id`

Edit your own message (within 15 minutes of sending).

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
    "message": "Hello cricket community! Ready for today's BIG match? 🏏🔥"
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "message": "Hello cricket community! Ready for today's BIG match? 🏏🔥",
    "messageType": "text",
    "sender": {
      "id": 5,
      "username": "virat_kohli",
      "email": "virat@example.com"
    },
    "attachmentUrls": [],
    "replyTo": null,
    "reactions": {
      "👍": [7, 10, 12],
      "🏏": [8]
    },
    "mentions": [],
    "isEdited": true,
    "editedAt": "2025-11-01T10:35:00.000Z",
    "isDeleted": false,
    "deletedAt": null,
    "tags": ["cricket", "match"],
    "createdAt": "2025-11-01T10:30:00.000Z",
    "updatedAt": "2025-11-01T10:35:00.000Z"
  },
  "meta": {
    "message": "Message updated successfully"
  }
}
```

---

### 5. Delete Message
**DELETE** `/chats/:id`

Delete your own message (soft delete).

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Example Request:**
```
DELETE /api/chats/1
```

**Response (200):**
```json
{
  "data": {
    "message": "Message deleted successfully",
    "id": "1"
  }
}
```

---

### 6. Add/Remove Reaction
**POST** `/chats/:id/reaction`

Add or remove emoji reaction to a message (WhatsApp-style toggle).

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
  "emoji": "👍"
}
```

**Response (200) - Reaction Added:**
```json
{
  "data": {
    "reactions": {
      "👍": [5, 7, 10],
      "❤️": [8],
      "🔥": [12, 15]
    },
    "message": "Reaction updated successfully"
  }
}
```

**Popular Emojis:**
- 👍 Thumbs up
- ❤️ Heart
- 😂 Laughing
- 🔥 Fire
- 🏏 Cricket
- 🎉 Celebration
- 👏 Clapping
- 💯 100

---

## 📊 Message Types & Examples

### Text Message
```json
{
  "data": {
    "message": "Hello everyone!",
    "messageType": "text"
  }
}
```

### Image Message
```json
{
  "data": {
    "message": "Check this amazing catch!",
    "messageType": "image",
    "attachments": [1]
  }
}
```

### Reply Message
```json
{
  "data": {
    "message": "Absolutely! Can't wait!",
    "messageType": "text",
    "replyTo": 1
  }
}
```

### Message with Mentions
```json
{
  "data": {
    "message": "Great game @virat_kohli and @rohit_sharma!",
    "messageType": "text",
    "mentions": [5, 7],
    "tags": ["cricket", "celebration"]
  }
}
```

---

## ❌ Error Responses

### 400 Bad Request - Empty Message
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Message cannot be empty"
  }
}
```

### 403 Forbidden - Edit Window Expired
```json
{
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "Messages can only be edited within 15 minutes of sending"
  }
}
```

### 429 Too Many Requests - Rate Limit
```json
{
  "error": {
    "status": 429,
    "name": "TooManyRequestsError",
    "message": "Rate limit exceeded. Maximum 50 messages per hour allowed"
  }
}
```

---

## 🎯 Features Summary

### ✅ WhatsApp-like Features:
- Real-time messaging
- Reply to messages (threading)
- Emoji reactions (toggle on/off)
- @Mention users
- Message editing (15-minute window)
- Message deletion (soft delete)
- File attachments (images, videos, audio, documents)
- Message tags for categorization
- Rate limiting (50 messages/hour)
- Pagination support
- User authentication and authorization

### 🔒 Security Features:
- JWT authentication required
- Input validation and sanitization
- XSS protection
- Rate limiting
- Ownership validation for edit/delete
- Soft delete (messages not permanently removed)

### 📱 Production Ready:
- Deployed at: https://cricket-d5rd.onrender.com
- PostgreSQL database
- Error handling and logging
- Performance optimized
- Industry-standard practices

---

## 🚀 Usage Examples

### Send Simple Message
```bash
curl -X POST https://cricket-d5rd.onrender.com/api/chats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "message": "Hello cricket community! 🏏",
      "messageType": "text"
    }
  }'
```

### Add Reaction
```bash
curl -X POST https://cricket-d5rd.onrender.com/api/chats/1/reaction \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emoji": "🔥"
  }'
```

### Get Messages
```bash
curl -X GET "https://cricket-d5rd.onrender.com/api/chats?page=1&pageSize=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

Your WhatsApp-style community chat is production-ready and deployed! 🎉💬