# 🚀 Cricket App API Documentation

## Base URL
```
https://cricket-d5rd.onrender.com/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 📖 Story API

### 1. Create Story
**POST** `/stories`

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
    "story": [1, 2, 3]
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "mediaUrls": [
      {
        "url": "https://cricket-d5rd.onrender.com/uploads/image1.jpg",
        "name": "image1.jpg",
        "mime": "image/jpeg",
        "size": 1024000
      }
    ],
    "likesCount": 0,
    "isLiked": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "meta": {
    "message": "Story created successfully"
  }
}
```

### 2. Get All Stories (Paginated)
**GET** `/stories?page=1&pageSize=10`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "mediaUrls": [
        {
          "url": "https://cricket-d5rd.onrender.com/uploads/image1.jpg",
          "name": "image1.jpg",
          "mime": "image/jpeg",
          "size": 1024000
        }
      ],
      "likesCount": 5,
      "isLiked": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50
    }
  }
}
```

### 3. Get Stories with Filters
**GET** `/stories/where?userId=123&liked=true&limit=5&offset=0`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Query Parameters:**
- `userId` - Filter by user ID
- `liked=true` - Get stories liked by current user
- `limit` - Number of results (default: 10)
- `offset` - Skip results for pagination (default: 0)

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "mediaUrls": [...],
      "likesCount": 5,
      "isLiked": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "filters": {
      "user": { "id": "123" }
    },
    "pagination": {
      "limit": 5,
      "offset": 0
    }
  }
}
```

### 4. Get Single Story
**GET** `/stories/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "mediaUrls": [...],
    "likesCount": 5,
    "isLiked": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Update Story
**PUT** `/stories/:id`

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
    "story": [4, 5, 6]
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "mediaUrls": [...],
    "likesCount": 5,
    "isLiked": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  },
  "meta": {
    "message": "Story updated successfully"
  }
}
```

### 6. Delete Story
**DELETE** `/stories/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "message": "Story deleted successfully",
    "id": "1"
  }
}
```

### 7. Bulk Delete Stories
**DELETE** `/stories/bulk-delete`

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
  "ids": [1, 2, 3, 4, 5]
}
```

**Response (200):**
```json
{
  "data": {
    "message": "5 stories deleted successfully",
    "deletedIds": [1, 2, 3, 4, 5],
    "failedIds": []
  }
}
```

### 8. Like/Unlike Story
**POST** `/stories/:id/like`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "isLiked": true,
    "likesCount": 6
  }
}
```

---

## 📝 Post API

### 1. Create Post
**POST** `/posts`

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
    "post": [1, 2, 3],
    "caption": "Amazing cricket match today! 🏏"
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "caption": "Amazing cricket match today! 🏏",
    "username": "john_doe",
    "email": "john@example.com",
    "mediaUrls": [
      {
        "url": "https://cricket-d5rd.onrender.com/uploads/image1.jpg",
        "name": "image1.jpg",
        "mime": "image/jpeg",
        "size": 1024000
      }
    ],
    "likesCount": 0,
    "isLiked": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "meta": {
    "message": "Post created successfully"
  }
}
```

### 2. Get All Posts (Paginated)
**GET** `/posts?page=1&pageSize=10`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "caption": "Amazing cricket match today! 🏏",
      "username": "john_doe",
      "email": "john@example.com",
      "mediaUrls": [...],
      "likesCount": 5,
      "isLiked": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50
    }
  }
}
```

### 3. Get Posts with Filters
**GET** `/posts/where?userId=123&liked=true&caption=cricket&limit=5&offset=0`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Query Parameters:**
- `userId` - Filter by user ID
- `liked=true` - Get posts liked by current user
- `caption` - Search in caption text
- `limit` - Number of results (default: 10)
- `offset` - Skip results for pagination (default: 0)

**Response (200):**
```json
{
  "data": [...],
  "meta": {
    "filters": {
      "user": { "id": "123" },
      "caption": { "$containsi": "cricket" }
    },
    "pagination": {
      "limit": 5,
      "offset": 0
    }
  }
}
```

### 4. Get Single Post
**GET** `/posts/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "caption": "Amazing cricket match today! 🏏",
    "username": "john_doe",
    "email": "john@example.com",
    "mediaUrls": [...],
    "likesCount": 5,
    "isLiked": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Update Post
**PUT** `/posts/:id`

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
    "post": [4, 5, 6],
    "caption": "Updated caption for the post"
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "caption": "Updated caption for the post",
    "username": "john_doe",
    "email": "john@example.com",
    "mediaUrls": [...],
    "likesCount": 5,
    "isLiked": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  },
  "meta": {
    "message": "Post updated successfully"
  }
}
```

### 6. Delete Post
**DELETE** `/posts/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "message": "Post deleted successfully",
    "id": "1"
  }
}
```

### 7. Like/Unlike Post
**POST** `/posts/:id/like`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "isLiked": true,
    "likesCount": 6
  }
}
```

---

## 💬 Chat API

### 1. Send Message
**POST** `/chats`

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
    "message": "Hello everyone! Ready for today's match?",
    "messageType": "text",
    "attachments": [1, 2],
    "replyTo": 5,
    "mentions": [10, 15],
    "tags": ["cricket", "match"]
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "message": "Hello everyone! Ready for today's match?",
    "messageType": "text",
    "sender": {
      "id": 1,
      "username": "john_doe",
      "email": "john@exampl
    },
    "attachmentUrls": [
      {
        "url": "https://cricket-d5rd.onrender.com/uploads/image1.jpg",
        "name": "image1.jpg",
        "mime": "image/jpeg",
        "size": 1024000
      }
    ],
    "replyTo": {
      "id": 5,
      "message": "Who's playing today?",
      "sender": "jane_doe"
    },
    "reactions": {},
    "mentions": [
      {
        "id": 10,
        "username": "player1"
      }
    ],
    "isEdited": false,
    "editedAt": null,
    "isDeleted": false,
    "deletedAt": null,
    "tags": ["cricket", "match"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "meta": {
    "message": "Message created successfully"
  }
}
```

### 2. Get All Messages (Paginated)
**GET** `/chats?page=1&pageSize=50`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "message": "Hello everyone! Ready for today's match?",
      "messageType": "text",
      "sender": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      },
      "attachmentUrls": [...],
      "replyTo": null,
      "reactions": {
        "👍": [1, 2, 3],
        "🏏": [4, 5]
      },
      "mentions": [...],
      "isEdited": false,
      "editedAt": null,
      "isDeleted": false,
      "deletedAt": null,
      "tags": ["cricket", "match"],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "pageCount": 3,
      "total": 150
    }
  }
}
```

### 3. Get Single Message
**GET** `/chats/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "message": "Hello everyone! Ready for today's match?",
    "messageType": "text",
    "sender": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "attachmentUrls": [...],
    "replyTo": null,
    "reactions": {},
    "mentions": [...],
    "isEdited": false,
    "editedAt": null,
    "isDeleted": false,
    "deletedAt": null,
    "tags": ["cricket", "match"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Edit Message
**PUT** `/chats/:id`

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
    "message": "Hello everyone! Ready for today's big match?"
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "message": "Hello everyone! Ready for today's big match?",
    "messageType": "text",
    "sender": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "attachmentUrls": [...],
    "replyTo": null,
    "reactions": {},
    "mentions": [...],
    "isEdited": true,
    "editedAt": "2024-01-15T10:45:00.000Z",
    "isDeleted": false,
    "deletedAt": null,
    "tags": ["cricket", "match"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  },
  "meta": {
    "message": "Message updated successfully"
  }
}
```

### 5. Delete Message (Soft Delete)
**DELETE** `/chats/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
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

### 6. Add/Remove Reaction
**POST** `/chats/:id/reaction`

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

**Response (200):**
```json
{
  "data": {
    "reactions": {
      "👍": [1, 2, 3],
      "🏏": [4, 5]
    },
    "message": "Reaction updated successfully"
  }
}
```

---

## 📊 Poll API

### 1. Create Poll
**POST** `/polls`

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
    "question": "Who will win today's match?",
    "description": "Vote for your favorite team",
    "options": [
      "Team A",
      "Team B",
      "Draw"
    ],
    "allowMultipleVotes": false
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "question": "Who will win today's match?",
    "description": "Vote for your favorite team",
    "options": [
      {
        "id": 1,
        "text": "Team A",
        "votes": 0
      },
      {
        "id": 2,
        "text": "Team B",
        "votes": 0
      },
      {
        "id": 3,
        "text": "Draw",
        "votes": 0
      }
    ],
    "creator": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "isActive": true,
    "allowMultipleVotes": false,
    "totalVotes": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "meta": {
    "message": "Poll created successfully"
  }
}
```

### 2. Get All Polls (Paginated)
**GET** `/polls?page=1&pageSize=10&active=true`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Query Parameters:**
- `active=true` - Filter only active polls

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "question": "Who will win today's match?",
      "description": "Vote for your favorite team",
      "options": [
        {
          "id": 1,
          "text": "Team A",
          "votes": 15
        },
        {
          "id": 2,
          "text": "Team B",
          "votes": 12
        },
        {
          "id": 3,
          "text": "Draw",
          "votes": 3
        }
      ],
      "creator": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      },
      "isActive": true,
      "allowMultipleVotes": false,
      "totalVotes": 30,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 2,
      "total": 15
    }
  }
}
```

### 3. Get Single Poll
**GET** `/polls/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "question": "Who will win today's match?",
    "description": "Vote for your favorite team",
    "options": [
      {
        "id": 1,
        "text": "Team A",
        "votes": 15
      },
      {
        "id": 2,
        "text": "Team B",
        "votes": 12
      },
      {
        "id": 3,
        "text": "Draw",
        "votes": 3
      }
    ],
    "creator": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "isActive": true,
    "allowMultipleVotes": false,
    "totalVotes": 30,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Poll
**PUT** `/polls/:id`

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
    "question": "Who will win today's championship match?",
    "description": "Updated description",
    "isActive": true
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "question": "Who will win today's championship match?",
    "description": "Updated description",
    "options": [...],
    "creator": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "isActive": true,
    "allowMultipleVotes": false,
    "totalVotes": 30,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  },
  "meta": {
    "message": "Poll updated successfully"
  }
}
```

### 5. Delete Poll
**DELETE** `/polls/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "message": "Poll deleted successfully",
    "id": "1"
  }
}
```

### 6. Vote on Poll
**POST** `/polls/:id/vote`

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
  "optionIds": [1]
}
```

**Response (200):**
```json
{
  "data": {
    "poll": {
      "id": 1,
      "question": "Who will win today's match?",
      "description": "Vote for your favorite team",
      "options": [
        {
          "id": 1,
          "text": "Team A",
          "votes": 16
        },
        {
          "id": 2,
          "text": "Team B",
          "votes": 12
        },
        {
          "id": 3,
          "text": "Draw",
          "votes": 3
        }
      ],
      "creator": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      },
      "isActive": true,
      "allowMultipleVotes": false,
      "totalVotes": 31,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:30:00.000Z"
    },
    "message": "Vote recorded successfully"
  }
}
```

---

## 💬 Comment API

### 1. Create Comment
**POST** `/comments`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

**Request Body (for Post):**
```json
{
  "data": {
    "text": "Great match! Amazing performance by both teams.",
    "post": 1
  }
}
```

**Request Body (for Story):**
```json
{
  "data": {
    "text": "Love this story! So inspiring.",
    "story": 1
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "text": "Great match! Amazing performance by both teams.",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "post": {
      "id": 1,
      "caption": "Amazing cricket match today! 🏏"
    },
    "story": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "meta": {
    "message": "Comment created successfully"
  }
}
```

### 2. Get All Comments (Paginated)
**GET** `/comments?page=1&pageSize=20&post=1`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Query Parameters:**
- `post` - Filter comments by post ID
- `story` - Filter comments by story ID

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "text": "Great match! Amazing performance by both teams.",
      "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      },
      "post": {
        "id": 1,
        "caption": "Amazing cricket match today! 🏏"
      },
      "story": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "pageCount": 3,
      "total": 45
    }
  }
}
```

### 3. Get Single Comment
**GET** `/comments/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "text": "Great match! Amazing performance by both teams.",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "post": {
      "id": 1,
      "caption": "Amazing cricket match today! 🏏"
    },
    "story": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Comment
**PUT** `/comments/:id`

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
    "text": "Great match! Amazing performance by both teams. What a thriller!"
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "text": "Great match! Amazing performance by both teams. What a thriller!",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "post": {
      "id": 1,
      "caption": "Amazing cricket match today! 🏏"
    },
    "story": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  },
  "meta": {
    "message": "Comment updated successfully"
  }
}
```

### 5. Delete Comment
**DELETE** `/comments/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

**Response (200):**
```json
{
  "data": {
    "message": "Comment deleted successfully",
    "id": "1"
  }
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Story must contain at least one media file"
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "You must be logged in to create a story"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "You can only delete your own stories"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Story not found"
  }
}
```

### 429 Too Many Requests
```json
{
  "error": {
    "status": 429,
    "name": "TooManyRequestsError",
    "message": "You can only create 5 stories per hour"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "status": 500,
    "name": "ApplicationError",
    "message": "Failed to create story"
  }
}
```

---

## 📋 Rate Limits

- **Stories**: 5 per hour per user
- **Posts**: 10 per hour per user
- **Chat Messages**: 50 per hour per user
- **Comments**: 30 per hour per user
- **Polls**: 5 per day per user

---

## 📝 Notes

1. **Media Upload**: Before creating stories/posts, upload media files using the Strapi upload endpoint and use the returned IDs in the `story`/`post` array.

2. **Pagination**: All list endpoints support pagination with `page` and `pageSize` parameters.

3. **Filtering**: Use query parameters to filter results based on various criteria.

4. **Authentication**: Most endpoints require JWT authentication. Get your token from the login endpoint.

5. **Rate Limiting**: API calls are rate-limited to prevent abuse. Check the rate limits section above.

6. **Media URLs**: All media URLs are automatically prefixed with the base URL.

---

## 🚀 Total Endpoints: 32

- **Story API**: 8 endpoints
- **Post API**: 7 endpoints  
- **Chat API**: 6 endpoints
- **Poll API**: 6 endpoints
- **Comment API**: 5 endpoints

All endpoints are production-ready with comprehensive validation, error handling, and security features! 🎉     