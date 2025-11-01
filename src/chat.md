# 💬 Strapi Chat Schema Setup Guide

## 📋 Collection Name: `chats` (or `messages`)e# 🎯 Required Fields for yle Group Chat

---

## 1️⃣ **Basic Message Fields**

### **message** (Text - Long text)
- **Tymd Long text)
- *fi Yes
- **Description**: The actual message content
- **Example**: "Hello everyone! Ready for the match?"

**Strapi Settings:**
```
Field name: message
Type: Text
Text type: Long text
Required: ✓
```

---

### **messageType** (Enumeration)
- **Type**: Enumeration
- **Required**: Yes
- **Default**: "text"
- **Values**: 
  - `text` - Regular text message
  - `image` - Image attachment
  - `video` - Video attachment
  - `audio` - Audio/voice message
  - `file` - Document/file attachment
  - `location` - Location share
  - `poll` - Poll message

**Strapi Settings:**
```
Field name: messageType
Type: Enumeration
Values: text, image, video, audio, file, location, poll
Default value: text
Required: ✓
```

---

## 2️⃣ **User Information Fields**

### **user** (Relation)
- **Type**: Relation
- **Relation**: Many-to-One with Users (from Users & Permissions)
- **Required**: Yes
- **Description**: The user who sent the message

**Strapi Settings:**
```
Field name: user
Type: Relation
Relation type: Many chats to One user (from users-permissions)
Required: ✓
```

**OR if you want to store user info directly:**

### **userId** (Number - Integer)
- **Type**: Number (Integer)
- **Required**: Yes
- **Description**: ID of the user who sent the message

### **userName** (Text - Short text)
- **Type**: Text (Short text)
- **Required**: No
- **Description**: Display name of the sender (cached for performance)

### **userAvatar** (Text - Short text)
- **Type**: Text (Short text)
- **Required**: No
- **Description**: Avatar URL of the sender (cached for performance)

---

## 3️⃣ **Attachment Fields**

### **attachments** (Media - Multiple files)
- **Type**: Media
- **Multiple**: Yes
- **Required**: No
- **Allowed types**: Images, Videos, Files, Audio
- **Description**: File attachments (images, videos, documents)

**Strapi Settings:**
```
Field name: attachments
Type: Media
Multiple files: ✓
Required: ✗
Allowed types: images, videos, files, audios
```

**OR use separate URL field:**

### **attachmentUrl** (Text - Short text)
- **Type**: Text (Short text)
- **Required**: No
- **Description**: URL of the attachment

### **attachmentType** (Enumeration)
- **Type**: Enumeration
- **Values**: `image`, `video`, `audio`, `file`
- **Required**: No

### **attachmentName** (Text - Short text)
- **Type**: Text (Short text)
- **Required**: No
- **Description**: Original filename

### **attachmentSize** (Number - Integer)
- **Type**: Number (Integer)
- **Required**: No
- **Description**: File size in bytes

---

## 4️⃣ **Timestamp Fields**

### **createdAt** (DateTime)
- **Type**: DateTime
- **Auto-generated**: Yes (Strapi default)
- **Description**: When the message was sent

### **updatedAt** (DateTime)
- **Type**: DateTime
- **Auto-generated**: Yes (Strapi default)
- **Description**: When the message was last edited

### **editedAt** (DateTime)
- **Type**: DateTime
- **Required**: No
- **Description**: When the message was edited (if edited)

---

## 5️⃣ **Message Status Fields**

### **isEdited** (Boolean)
- **Type**: Boolean
- **Default**: false
- **Required**: No
- **Description**: Whether the message has been edited

**Strapi Settings:**
```
Field name: isEdited
Type: Boolean
Default value: false
```

### **isDeleted** (Boolean)
- **Type**: Boolean
- **Default**: false
- **Required**: No
- **Description**: Soft delete flag

### **deletedAt** (DateTime)
- **Type**: DateTime
- **Required**: No
- **Description**: When the message was deleted

---

## 6️⃣ **Reaction/Interaction Fields**

### **reactions** (JSON)
- **Type**: JSON
- **Required**: No
- **Description**: Emoji reactions to the message
- **Example**: 
```json
{
  "👍": ["user1", "user2"],
  "❤️": ["user3"],
  "😂": ["user4", "user5"]
}
```

**Strapi Settings:**
```
Field name: reactions
Type: JSON
Required: ✗
```

### **replyTo** (Relation)
- **Type**: Relation
- **Relation**: Many-to-One with Chats (self-relation)
- **Required**: No
- **Description**: Reference to the message being replied to

**Strapi Settings:**
```
Field name: replyTo
Type: Relation
Relation type: Many chats to One chat (self)
Required: ✗
```

---

## 7️⃣ **Additional Metadata Fields**

### **mentions** (JSON)
- **Type**: JSON
- **Required**: No
- **Description**: Users mentioned in the message (@username)
- **Example**: `["user1", "user2"]`

### **metadata** (JSON)
- **Type**: JSON
- **Required**: No
- **Description**: Additional data (location coords, poll data, etc.)
- **Example**:
```json
{
  "location": {
    "lat": 19.0760,
    "lng": 72.8777,
    "name": "Mumbai"
  }
}
```

---

## 📝 **Complete Field List Summary**

### ✅ **Minimal Required Fields:**
1. `message` - Text (Long text) - Required
2. `messageType` - Enumeration - Required
3. `user` - Relation to User - Required
4. `createdAt` - DateTime (auto) - Required
5. `updatedAt` - DateTime (auto) - Required

### ⭐ **Recommended Fields:**
6. `userName` - Text (Short text) - For caching
7. `userAvatar` - Text (Short text) - For caching
8. `attachments` - Media (Multiple) - For files
9. `isEdited` - Boolean - For edit tracking
10. `isDeleted` - Boolean - For soft delete

### 🎨 **Advanced Features:**
11. `reactions` - JSON - For emoji reactions
12. `replyTo` - Relation (self) - For threaded replies
13. `mentions` - JSON - For @mentions
14. `metadata` - JSON - For extra data
15. `editedAt` - DateTime - Edit timestamp

---

## 🚀 **Step-by-Step Setup in Strapi**

### **Step 1: Create Collection**
1. Go to Strapi Admin: `https://cricket-d5rd.onrender.com/admin`
2. Click **Content-Type Builder** (left sidebar)
3. Click **Create new collection type**
4. Enter name: `chat` (singular) or `message`
5. Click **Continue**

### **Step 2: Add Fields**

#### **Add message field:**
1. Click **Add another field**
2. Select **Text**
3. Name: `message`
4. Advanced Settings → Text type: **Long text**
5. Check **Required field**
6. Click **Finish**

#### **Add messageType field:**
1. Click **Add another field**
2. Select **Enumeration**
3. Name: `messageType`
4. Add values: `text`, `image`, `video`, `audio`, `file`
5. Default value: `text`
6. Check **Required field**
7. Click **Finish**

#### **Add user relation:**
1. Click **Add another field**
2. Select **Relation**
3. Select: **User (from: users-permissions)**
4. Relation type: **Many chats to One user**
5. Field name: `user`
6. Check **Required field**
7. Click **Finish**

#### **Add userName field (cached):**
1. Click **Add another field**
2. Select **Text**
3. Name: `userName`
4. Text type: **Short text**
5. Click **Finish**

#### **Add userAvatar field (cached):**
1. Click **Add another field**
2. Select **Text**
3. Name: `userAvatar`
4. Text type: **Short text**
5. Click **Finish**

#### **Add attachments field:**
1. Click **Add another field**
2. Select **Media**
3. Name: `attachments`
4. Type: **Multiple files**
5. Allowed types: Check all (images, videos, files, audios)
6. Click **Finish**

#### **Add isEdited field:**
1. Click **Add another field**
2. Select **Boolean**
3. Name: `isEdited`
4. Default value: `false`
5. Click **Finish**

#### **Add isDeleted field:**
1. Click **Add another field**
2. Select **Boolean**
3. Name: `isDeleted`
4. Default value: `false`
5. Click **Finish**

#### **Add reactions field:**
1. Click **Add another field**
2. Select **JSON**
3. Name: `reactions`
4. Click **Finish**

#### **Add replyTo field (optional):**
1. Click **Add another field**
2. Select **Relation**
3. Select: **Chat (same collection)**
4. Relation type: **Many chats to One chat**
5. Field name: `replyTo`
6. Click **Finish**

#### **Add metadata field:**
1. Click **Add another field**
2. Select **JSON**
3. Name: `metadata`
4. Click **Finish**

### **Step 3: Save**
1. Click **Save** (top right)
2. Wait for Strapi to restart

### **Step 4: Set Permissions**
1. Go to **Settings** → **Users & Permissions** → **Roles**
2. Click **Authenticated**
3. Scroll to **Chat** (or your collection name)
4. Enable permissions:
   - ✅ `find` - Get all messages
   - ✅ `findOne` - Get single message
   - ✅ `create` - Send message
   - ✅ `update` - Edit own message
   - ✅ `delete` - Delete own message
5. Click **Save**

---

## 📊 **Example API Requests**

### **Create Message (Send):**
```json
POST /api/chats
{
  "data": {
    "message": "Hello everyone!",
    "messageType": "text",
    "user": 13,
    "userName": "Virat Kohli",
    "userAvatar": "https://..."
  }
}
```

### **Create Message with Attachment:**
```json
POST /api/chats
{
  "data": {
    "message": "Check out this photo!",
    "messageType": "image",
    "user": 13,
    "userName": "Virat Kohli",
    "attachments": [1, 2]
  }
}
```

### **Get Messages:**
```
GET /api/chats?populate=*&sort=createdAt:desc&pagination[pageSize]=50
```

### **Update Message (Edit):**
```json
PUT /api/chats/:id
{
  "data": {
    "message": "Updated message",
    "isEdited": true,
    "editedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### **Add Reaction:**
```json
PUT /api/chats/:id
{
  "data": {
    "reactions": {
      "👍": ["user1", "user2"],
      "❤️": ["user3"]
    }
  }
}
```

### **Reply to Message:**
```json
POST /api/chats
{
  "data": {
    "message": "Great point!",
    "messageType": "text",
    "user": 13,
    "replyTo": 45
  }
}
```

---

## 🎨 **Visual Schema Diagram**

```
Chat/Message Collection
├── message (Text - Long) ✓ Required
├── messageType (Enum) ✓ Required
│   └── Values: text, image, video, audio, file
├── user (Relation → User) ✓ Required
├── userName (Text - Short) - Cached
├── userAvatar (Text - Short) - Cached
├── attachments (Media - Multiple)
├── isEdited (Boolean) - Default: false
├── isDeleted (Boolean) - Default: false
├── reactions (JSON)
├── replyTo (Relation → Chat) - Self relation
├── mentions (JSON)
├── metadata (JSON)
├── editedAt (DateTime)
├── createdAt (DateTime) - Auto
└── updatedAt (DateTime) - Auto
```

---

## ✅ **Checklist**

- [ ] Create `chats` collection
- [ ] Add `message` field (Text - Long, Required)
- [ ] Add `messageType` field (Enum, Required)
- [ ] Add `user` relation (Many-to-One, Required)
- [ ] Add `userName` field (Text - Short)
- [ ] Add `userAvatar` field (Text - Short)
- [ ] Add `attachments` field (Media - Multiple)
- [ ] Add `isEdited` field (Boolean)
- [ ] Add `isDeleted` field (Boolean)
- [ ] Add `reactions` field (JSON)
- [ ] Add `replyTo` relation (Self)
- [ ] Add `metadata` field (JSON)
- [ ] Save collection
- [ ] Set permissions for Authenticated role
- [ ] Test API with Postman/curl

---

## 🎯 **Result**

After setup, your chat will support:
- ✅ Text messages
- ✅ User identification (name + avatar)
- ✅ File attachments (images, videos, documents)
- ✅ Message editing
- ✅ Message deletion (soft delete)
- ✅ Emoji reactions
- ✅ Threaded replies
- ✅ @mentions
- ✅ Timestamps (sent, edited)
- ✅ WhatsApp-style group chat experience

Perfect for your Cricket Connect community chat! 🏏💬
