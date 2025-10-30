# 🚀 Cricket App API Documentation

## Base URL
```
http://localhost:1337/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## �  Instagram-like Post API

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
    "caption": "My first Instagram-like post! 🏏",
    "post": []
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "caption": "My first Instagram-like post! 🏏",
    "user": {
      "id": 5,
      "username": "player1235444",
      "email": "player123445@example.com"
    },
    "mediaUrls": [],
    "likeCount": 0,
    "commentCount": 0,
    "isLiked": false,
    "createdAt": "2025-10-30T16:20:40.997Z",
    "updatedAt": "2025-10-30T16:20:40.997Z"
  },
  "meta": {
    "message": "Post created successfully"
  }
}
```

### 2. Get All Posts (Instagram Feed)
**GET** `/posts`

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
      "id": 2,
      "caption": "Another awesome cricket moment! Who's your favorite player? 🏆",
      "user": {
        "id": 5,
        "username": "player1235444",
        "email": "player123445@example.com"
      },
      "mediaUrls": [],
      "likeCount": 0,
      "commentCount": 0,
      "isLiked": false,
      "createdAt": "2025-10-30T16:33:14.561Z",
      "updatedAt": "2025-10-30T16:33:14.561Z"
    },
    {
      "id": 1,
      "caption": "My first Instagram-like post! 🏏",
      "user": {
        "id": 5,
        "username": "player1235444",
        "email": "player123445@example.com"
      },
      "mediaUrls": [],
      "likeCount": 0,
      "commentCount": 0,
      "isLiked": false,
      "createdAt": "2025-10-30T16:20:40.997Z",
      "updatedAt": "2025-10-30T16:28:55.261Z"
    }
  ]
}
```

### 3. Get Single Post
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
    "caption": "My first Instagram-like post! 🏏",
    "user": {
      "id": 5,
      "username": "player1235444",
      "email": "player123445@example.com"
    },
    "mediaUrls": [],
    "likeCount": 0,
    "commentCount": 0,
    "isLiked": false,
    "createdAt": "2025-10-30T16:20:40.997Z",
    "updatedAt": "2025-10-30T16:28:55.261Z"
  }
}
```

### 4. Like/Unlike Post (Instagram Style)
**POST** `/posts/:id/like`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

**Response (200) - Like:**
```json
{
  "data": {
    "id": 1,
    "caption": "My first Instagram-like post! 🏏",
    "user": {
      "id": 5,
      "username": "player1235444",
      "email": "player123445@example.com"
    },
    "mediaUrls": [],
    "likeCount": 1,
    "commentCount": 0,
    "isLiked": true,
    "createdAt": "2025-10-30T16:20:40.997Z",
    "updatedAt": "2025-10-30T16:28:38.992Z",
    "message": "Post liked successfully"
  }
}
```

**Response (200) - Unlike:**
```json
{
  "data": {
    "id": 1,
    "caption": "My first Instagram-like post! 🏏",
    "user": {
      "id": 5,
      "username": "player1235444",
      "email": "player123445@example.com"
    },
    "mediaUrls": [],
    "likeCount": 0,
    "commentCount": 0,
    "isLiked": false,
    "createdAt": "2025-10-30T16:20:40.997Z",
    "updatedAt": "2025-10-30T16:28:55.261Z",
    "message": "Post unliked successfully"
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
    "caption": "Updated caption for my post! 🏏✨"
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "caption": "Updated caption for my post! 🏏✨",
    "user": {
      "id": 5,
      "username": "player1235444",
      "email": "player123445@example.com"
    },
    "mediaUrls": [],
    "likeCount": 0,
    "commentCount": 0,
    "isLiked": false,
    "createdAt": "2025-10-30T16:20:40.997Z",
    "updatedAt": "2025-10-30T16:35:00.000Z"
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
    "message": "Post deleted successfully"
  }
}
```

---

## 💬 Instagram-like Comment API

### 1. Create Comment
**POST** `/comments`

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
    "text": "Great post! Love the cricket content! 🏏",
    "post": 1
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "text": "Great post! Love the cricket content! 🏏",
    "user": {
      "id": 5,
      "username": "player1235444",
      "email": "player123445@example.com"
    },
    "post": {
      "id": 1,
      "caption": "My first Instagram-like post! 🏏"
    },
    "story": null,
    "createdAt": "2025-10-30T16:26:13.152Z",
    "updatedAt": "2025-10-30T16:26:13.152Z"
  },
  "meta": {
    "message": "Comment created successfully"
  }
}
```

### 2. Get Comments for Post
**GET** `/comments?post=:postId`

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
      "id": 2,
      "text": "Amazing cricket post! Can't wait for the next match! 🔥",
      "user": {
        "id": 5,
        "username": "player1235444",
        "email": "player123445@example.com"
      },
      "post": {
        "id": 1,
        "caption": "My first Instagram-like post! 🏏"
      },
      "story": null,
      "createdAt": "2025-10-30T16:30:41.508Z",
      "updatedAt": "2025-10-30T16:30:41.508Z"
    },
    {
      "id": 1,
      "text": "Great post! Love the cricket content! 🏏",
      "user": {
        "id": 5,
        "username": "player1235444",
        "email": "player123445@example.com"
      },
      "post": {
        "id": 1,
        "caption": "My first Instagram-like post! 🏏"
      },
      "story": null,
      "createdAt": "2025-10-30T16:26:13.152Z",
      "updatedAt": "2025-10-30T16:26:13.152Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 1,
      "total": 2
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
    "text": "Great post! Love the cricket content! 🏏",
    "user": {
      "id": 5,
      "username": "player1235444",
      "email": "player123445@example.com"
    },
    "post": {
      "id": 1,
      "caption": "My first Instagram-like post! 🏏"
    },
    "story": null,
    "createdAt": "2025-10-30T16:26:13.152Z",
    "updatedAt": "2025-10-30T16:26:13.152Z"
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
    "text": "Great post! Love the cricket content! Amazing match! 🏏🔥"
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "text": "Great post! Love the cricket content! Amazing match! 🏏🔥",
    "user": {
      "id": 5,
      "username": "player1235444",
      "email": "player123445@example.com"
    },
    "post": {
      "id": 1,
      "caption": "My first Instagram-like post! 🏏"
    },
    "story": null,
    "createdAt": "2025-10-30T16:26:13.152Z",
    "updatedAt": "2025-10-30T16:35:00.000Z"
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

## 📊 WhatsApp-like Poll API

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
    "question": "Which is your favorite cricket format?",
    "options": [
      "Test Cricket",
      "ODI",
      "T20"
    ]
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "question": "Which is your favorite cricket format?",
    "createdAt": "2025-10-30T15:42:23.139Z",
    "updatedAt": "2025-10-30T15:42:23.139Z",
    "publishedAt": "2025-10-30T15:42:23.129Z",
    "locale": null,
    "isActive": true,
    "allowMultipleVotes": false,
    "votes": [],
    "options": [
      {
        "id": 0,
        "text": "Test Cricket",
        "voteCount": 0,
        "votes": 0,
        "percentage": 0
      },
      {
        "id": 1,
        "text": "ODI",
        "voteCount": 0,
        "votes": 0,
        "percentage": 0
      },
      {
        "id": 2,
        "text": "T20",
        "voteCount": 0,
        "votes": 0,
        "percentage": 0
      }
    ],
    "createdBy": null,
    "totalVotes": 0,
    "hasVoted": false
  }
}
```

### 2. Get All Polls
**GET** `/polls`

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
      "question": "Which is your favorite cricket format?",
      "createdAt": "2025-10-30T15:42:23.139Z",
      "updatedAt": "2025-10-30T15:44:53.066Z",
      "publishedAt": "2025-10-30T15:44:53.054Z",
      "locale": null,
      "isActive": true,
      "allowMultipleVotes": false,
      "votes": [
        {
          "userId": 5,
          "username": "player1235444",
          "optionIndex": 2,
          "votedAt": "2025-10-30T15:44:53.051Z"
        }
      ],
      "options": [
        {
          "id": 0,
          "text": "Test Cricket",
          "voteCount": 0,
          "votes": 0,
          "percentage": 0
        },
        {
          "id": 1,
          "text": "ODI",
          "voteCount": 0,
          "votes": 0,
          "percentage": 0
        },
        {
          "id": 2,
          "text": "T20",
          "voteCount": 0,
          "votes": 1,
          "percentage": 100
        }
      ],
      "createdBy": null,
      "totalVotes": 1,
      "hasVoted": true,
      "userVote": 2
    }
  ]
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
    "question": "Which is your favorite cricket format?",
    "createdAt": "2025-10-30T15:42:23.139Z",
    "updatedAt": "2025-10-30T15:44:53.066Z",
    "publishedAt": "2025-10-30T15:44:53.054Z",
    "locale": null,
    "isActive": true,
    "allowMultipleVotes": false,
    "votes": [
      {
        "userId": 5,
        "username": "player1235444",
        "optionIndex": 2,
        "votedAt": "2025-10-30T15:44:53.051Z"
      }
    ],
    "options": [
      {
        "id": 0,
        "text": "Test Cricket",
        "voteCount": 0,
        "votes": 0,
        "percentage": 0
      },
      {
        "id": 1,
        "text": "ODI",
        "voteCount": 0,
        "votes": 0,
        "percentage": 0
      },
      {
        "id": 2,
        "text": "T20",
        "voteCount": 0,
        "votes": 1,
        "percentage": 100
      }
    ],
    "createdBy": null,
    "totalVotes": 1,
    "hasVoted": true,
    "userVote": 2,
    "voters": [
      {
        "userId": 5,
        "username": "player1235444",
        "selectedOption": 2
      }
    ]
  }
}
```

### 4. Vote on Poll (WhatsApp Style)
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
  "optionIndex": 0
}
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