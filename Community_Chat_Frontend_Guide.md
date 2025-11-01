# 💬 Community Chat - Frontend Integration Guide

## 🎯 Quick Start

This guide helps you integrate the WhatsApp-style community chat into your frontend application.

---

## 📦 API Endpoints Summary

| Method | Endpoint                  | Purpose                      |
| ------ | ------------------------- | ---------------------------- |
| POST   | `/api/chats`              | Send a message               |
| GET    | `/api/chats`              | Get all messages (paginated) |
| GET    | `/api/chats/:id`          | Get single message           |
| PUT    | `/api/chats/:id`          | Edit message (15-min window) |
| DELETE | `/api/chats/:id`          | Delete message               |
| POST   | `/api/chats/:id/reaction` | Add/remove emoji reaction    |

---

## 🔐 Authentication

All requests require JWT token in the Authorization header:

```javascript
const headers = {
  Authorization: `Bearer ${userToken}`,
  "Content-Type": "application/json",
};
```

---

## 💬 1. Send a Message

### Simple Text Message

```javascript
async function sendMessage(message, token) {
  const response = await fetch("http://localhost:1337/api/chats", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        message: message,
        messageType: "text",
      },
    }),
  });

  return await response.json();
}

// Usage
const result = await sendMessage("Hello everyone! 🏏", userToken);
console.log(result.data); // Message object
```

### Message with Image/Video

```javascript
async function sendMediaMessage(message, attachmentIds, messageType, token) {
  const response = await fetch("http://localhost:1337/api/chats", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        message: message,
        messageType: messageType, // 'image', 'video', 'audio', 'file'
        attachments: attachmentIds,
      },
    }),
  });

  return await response.json();
}

// Usage
const result = await sendMediaMessage(
  "Check this out!",
  [1, 2], // Array of uploaded media IDs
  "image",
  userToken
);
```

### Reply to a Message

```javascript
async function replyToMessage(message, replyToId, token) {
  const response = await fetch("http://localhost:1337/api/chats", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        message: message,
        messageType: "text",
        replyTo: replyToId,
      },
    }),
  });

  return await response.json();
}

// Usage
const result = await replyToMessage("Great point!", 5, userToken);
```

### Mention Users

```javascript
async function sendMessageWithMentions(message, mentionedUserIds, token) {
  const response = await fetch("http://localhost:1337/api/chats", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        message: message,
        messageType: "text",
        mentions: mentionedUserIds,
      },
    }),
  });

  return await response.json();
}

// Usage
const result = await sendMessageWithMentions(
  "@virat_kohli @rohit_sharma Great game!",
  [5, 7], // User IDs
  userToken
);
```

---

## 📥 2. Get Messages (Chat History)

### Get Latest Messages

```javascript
async function getMessages(page = 1, pageSize = 50, token) {
  const response = await fetch(
    `http://localhost:1337/api/chats?page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
}

// Usage
const result = await getMessages(1, 50, userToken);
console.log(result.data); // Array of messages
console.log(result.meta.pagination); // Pagination info
```

### Load More Messages (Infinite Scroll)

```javascript
class ChatManager {
  constructor(token) {
    this.token = token;
    this.currentPage = 1;
    this.pageSize = 50;
    this.messages = [];
    this.hasMore = true;
  }

  async loadMessages() {
    if (!this.hasMore) return;

    const result = await getMessages(
      this.currentPage,
      this.pageSize,
      this.token
    );

    this.messages = [...this.messages, ...result.data];
    this.currentPage++;

    const { page, pageCount } = result.meta.pagination;
    this.hasMore = page < pageCount;

    return result.data;
  }
}

// Usage
const chatManager = new ChatManager(userToken);
const messages = await chatManager.loadMessages(); // Load first page
const moreMessages = await chatManager.loadMessages(); // Load next page
```

---

## ✏️ 3. Edit Message

```javascript
async function editMessage(messageId, newMessage, token) {
  const response = await fetch(`http://localhost:1337/api/chats/${messageId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        message: newMessage,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return await response.json();
}

// Usage
try {
  const result = await editMessage(1, "Updated message!", userToken);
  console.log(result.data.isEdited); // true
  console.log(result.data.editedAt); // Timestamp
} catch (error) {
  console.error(error.message); // "Messages can only be edited within 15 minutes of sending"
}
```

---

## 🗑️ 4. Delete Message

```javascript
async function deleteMessage(messageId, token) {
  const response = await fetch(`http://localhost:1337/api/chats/${messageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

// Usage
const result = await deleteMessage(1, userToken);
console.log(result.data.message); // "Message deleted successfully"
```

---

## 😊 5. Add/Remove Reactions (WhatsApp Style)

### Toggle Reaction

```javascript
async function toggleReaction(messageId, emoji, token) {
  const response = await fetch(
    `http://localhost:1337/api/chats/${messageId}/reaction`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emoji: emoji,
      }),
    }
  );

  return await response.json();
}

// Usage
const result = await toggleReaction(1, "👍", userToken);
console.log(result.data.reactions); // { "👍": [5, 7, 10], "❤️": [8] }
```

### Popular Emojis

```javascript
const POPULAR_EMOJIS = [
  "👍", // Thumbs up
  "❤️", // Heart
  "😂", // Laughing
  "🔥", // Fire
  "🏏", // Cricket
  "🎉", // Celebration
  "👏", // Clapping
  "💯", // 100
];
```

---

## 🎨 React Component Examples

### Message List Component

```jsx
import React, { useState, useEffect } from "react";

function ChatMessageList({ token }) {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:1337/api/chats?page=${page}&pageSize=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      setMessages((prev) => [...prev, ...result.data]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} token={token} />
      ))}
      {loading && <div>Loading...</div>}
      <button onClick={loadMessages}>Load More</button>
    </div>
  );
}
```

### Message Item Component

```jsx
function MessageItem({ message, token }) {
  const [reactions, setReactions] = useState(message.reactions || {});

  async function handleReaction(emoji) {
    try {
      const response = await fetch(
        `http://localhost:1337/api/chats/${message.id}/reaction`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emoji }),
        }
      );
      const result = await response.json();
      setReactions(result.data.reactions);
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  }

  return (
    <div className="message">
      <div className="message-header">
        <strong>{message.sender.username}</strong>
        <span>{new Date(message.createdAt).toLocaleString()}</span>
        {message.isEdited && <span className="edited">edited</span>}
      </div>

      {message.replyTo && (
        <div className="reply-context">
          Replying to: {message.replyTo.message}
        </div>
      )}

      <div className="message-content">{message.message}</div>

      {message.attachmentUrls.length > 0 && (
        <div className="attachments">
          {message.attachmentUrls.map((file, idx) => (
            <img key={idx} src={file.url} alt={file.name} />
          ))}
        </div>
      )}

      <div className="reactions">
        {Object.entries(reactions).map(([emoji, userIds]) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className="reaction-button"
          >
            {emoji} {userIds.length}
          </button>
        ))}
        <button onClick={() => handleReaction("👍")}>+</button>
      </div>
    </div>
  );
}
```

### Send Message Component

```jsx
function SendMessageForm({ token, replyTo = null }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const response = await fetch("http://localhost:1337/api/chats", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            message: message.trim(),
            messageType: "text",
            replyTo: replyTo,
          },
        }),
      });

      if (response.ok) {
        setMessage("");
        // Refresh messages or add to list
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="send-message-form">
      {replyTo && (
        <div className="replying-to">Replying to message #{replyTo}</div>
      )}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        maxLength={2000}
        disabled={sending}
      />
      <button type="submit" disabled={sending || !message.trim()}>
        Send
      </button>
    </form>
  );
}
```

---

## 🔄 Real-time Updates (Polling)

### Simple Polling Implementation

```javascript
class ChatPoller {
  constructor(token, onNewMessages) {
    this.token = token;
    this.onNewMessages = onNewMessages;
    this.lastMessageId = null;
    this.intervalId = null;
  }

  start(intervalMs = 3000) {
    this.intervalId = setInterval(() => this.poll(), intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async poll() {
    try {
      const response = await fetch(
        "http://localhost:1337/api/chats?page=1&pageSize=10",
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      const result = await response.json();

      if (result.data.length > 0) {
        const latestId = result.data[0].id;

        if (this.lastMessageId && latestId > this.lastMessageId) {
          // New messages available
          const newMessages = result.data.filter(
            (msg) => msg.id > this.lastMessageId
          );
          this.onNewMessages(newMessages);
        }

        this.lastMessageId = latestId;
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  }
}

// Usage
const poller = new ChatPoller(userToken, (newMessages) => {
  console.log("New messages:", newMessages);
  // Update UI with new messages
});

poller.start(3000); // Poll every 3 seconds

// Stop polling when component unmounts
// poller.stop();
```

---

## 📱 Message Types

```javascript
const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  FILE: "file",
  MATCH_INVITE: "match_invite",
  CELEBRATION: "celebration",
};

// Usage
await sendMessage("Hello!", MESSAGE_TYPES.TEXT, token);
```

---

## ⚠️ Error Handling

```javascript
async function sendMessageWithErrorHandling(message, token) {
  try {
    const response = await fetch("http://localhost:1337/api/chats", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: { message, messageType: "text" },
      }),
    });

    if (!response.ok) {
      const error = await response.json();

      switch (error.error.status) {
        case 400:
          alert("Invalid message. Please check your input.");
          break;
        case 401:
          alert("Please log in again.");
          // Redirect to login
          break;
        case 403:
          alert("You cannot edit this message.");
          break;
        case 429:
          alert("Too many messages. Please wait a moment.");
          break;
        default:
          alert("Something went wrong. Please try again.");
      }

      throw new Error(error.error.message);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
```

---

## 🎯 Best Practices

### 1. Message Validation

```javascript
function validateMessage(message) {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: "Message cannot be empty" };
  }

  if (message.length > 2000) {
    return { valid: false, error: "Message too long (max 2000 characters)" };
  }

  return { valid: true };
}

// Usage
const validation = validateMessage(userInput);
if (!validation.valid) {
  alert(validation.error);
  return;
}
```

### 2. Rate Limit Handling

```javascript
class RateLimitTracker {
  constructor() {
    this.messageCount = 0;
    this.resetTime = Date.now() + 3600000; // 1 hour
  }

  canSendMessage() {
    if (Date.now() > this.resetTime) {
      this.messageCount = 0;
      this.resetTime = Date.now() + 3600000;
    }

    return this.messageCount < 50;
  }

  incrementCount() {
    this.messageCount++;
  }

  getRemainingMessages() {
    return Math.max(0, 50 - this.messageCount);
  }
}

// Usage
const rateLimiter = new RateLimitTracker();

if (!rateLimiter.canSendMessage()) {
  alert("Rate limit reached. Please wait.");
  return;
}

await sendMessage(message, token);
rateLimiter.incrementCount();
```

### 3. Optimistic UI Updates

```javascript
async function sendMessageOptimistic(message, token, updateUI) {
  // Immediately show message in UI
  const tempMessage = {
    id: "temp-" + Date.now(),
    message,
    sender: { username: "You" },
    createdAt: new Date().toISOString(),
    sending: true,
  };

  updateUI(tempMessage);

  try {
    const result = await sendMessage(message, token);
    // Replace temp message with real one
    updateUI(result.data, tempMessage.id);
  } catch (error) {
    // Remove temp message and show error
    updateUI(null, tempMessage.id, error);
  }
}
```

---

## 📊 Complete Example: Chat Component

```jsx
import React, { useState, useEffect, useRef } from "react";

function CommunityChat({ token, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadMessages() {
    try {
      const response = await fetch(
        "http://localhost:1337/api/chats?page=1&pageSize=50",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      setMessages(result.data.reverse()); // Oldest first for display
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:1337/api/chats", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            message: newMessage.trim(),
            messageType: "text",
            replyTo: replyTo?.id,
          },
        }),
      });

      if (response.ok) {
        setNewMessage("");
        setReplyTo(null);
        await loadMessages();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  async function handleReaction(messageId, emoji) {
    try {
      await fetch(`http://localhost:1337/api/chats/${messageId}/reaction`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emoji }),
      });
      await loadMessages();
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="community-chat">
      <div className="chat-header">
        <h2>🏏 Cricket Community Chat</h2>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender.id === currentUserId ? "own" : ""}`}
          >
            <div className="message-header">
              <strong>{msg.sender.username}</strong>
              <span className="time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
              {msg.isEdited && <span className="edited">edited</span>}
            </div>

            {msg.replyTo && (
              <div className="reply-context">
                <small>
                  ↩️ {msg.replyTo.sender}: {msg.replyTo.message}
                </small>
              </div>
            )}

            <div className="message-content">{msg.message}</div>

            {msg.attachmentUrls?.length > 0 && (
              <div className="attachments">
                {msg.attachmentUrls.map((file, idx) => (
                  <img key={idx} src={file.url} alt={file.name} />
                ))}
              </div>
            )}

            <div className="message-actions">
              <button onClick={() => setReplyTo(msg)}>Reply</button>
              <div className="reactions">
                {["👍", "❤️", "😂", "🔥", "🏏"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(msg.id, emoji)}
                    className="reaction-btn"
                  >
                    {emoji}
                    {msg.reactions?.[emoji]?.length > 0 && (
                      <span>{msg.reactions[emoji].length}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        {replyTo && (
          <div className="replying-to">
            Replying to {replyTo.sender.username}
            <button onClick={() => setReplyTo(null)}>✕</button>
          </div>
        )}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={2000}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default CommunityChat;
```

---

## ✅ Checklist for Integration

- [ ] Set up authentication (JWT token)
- [ ] Implement message sending
- [ ] Implement message loading with pagination
- [ ] Add reply functionality
- [ ] Add emoji reactions
- [ ] Add message editing (with 15-min check)
- [ ] Add message deletion
- [ ] Implement real-time updates (polling or WebSocket)
- [ ] Add error handling
- [ ] Add rate limit handling
- [ ] Add loading states
- [ ] Add optimistic UI updates
- [ ] Style components (WhatsApp-like design)
- [ ] Test all features

---

**Your WhatsApp-style community chat is ready to integrate! 🚀💬**
