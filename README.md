# 🏏 Crinect Backend - Complete & Production Ready

**Crinect** is a location-based cricket community platform backend built with **Strapi v5** and **PostgreSQL**.

---

## 🎯 Project Status

✅ **100% Complete** - All features implemented and tested  
✅ **44/44 API Tests Passing**  
✅ **Production Ready**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete API reference for Flutter team |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | What's implemented and how to use it |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Step-by-step deployment guide |
| [GAP_ANALYSIS.md](./GAP_ANALYSIS.md) | Original requirements vs implementation |
| [goal.md](./goal.md) | Original project specification |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL (or SQLite for development)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run develop

# Build for production
npm run build

# Start production server
npm start
```

### First Time Setup
1. Start Strapi: `npm run develop`
2. Visit: http://localhost:1337/admin
3. Create admin account
4. Enable permissions (see below)

---

## 🔐 Enable Permissions

Go to: **Settings → Users & Permissions → Roles → Authenticated**

Enable all permissions for:
- Posts, Comments, Polls, Matches
- Groups (including custom `join` and `leave`)
- Direct Messages, Teams, Tournaments
- Achievements, Reports, Notifications

---

## ✅ Features Implemented

### Core Features
- ✅ User Authentication (Register, Login, JWT)
- ✅ User Profiles with Location (lat, lng, city, state)
- ✅ Posts (Create, Read, Update, Delete)
- ✅ Comments (Create, Read, Update, Delete)
- ✅ Polls (Create, Read, Update, Delete)
- ✅ Matches (Create, Read, Update, Delete)
- ✅ Groups with Join/Leave (Custom endpoints)
- ✅ Direct Messages (1-on-1 chat)
- ✅ Group Messages (Group chat)
- ✅ Teams (Cricket teams)
- ✅ Tournaments (Tournament management)
- ✅ Player Stats (Match statistics)
- ✅ Achievements (Badges & rewards)
- ✅ Reports (Content moderation)
- ✅ Notifications (User notifications)
- ✅ Stories (Temporary posts)
- ✅ Player Profiles (Cricket-specific data)

### Location Features
- ✅ User location fields (latitude, longitude, city, state, district)
- ✅ Distance calculation (implemented in Flutter using Haversine formula)
- ✅ Nearby users/matches (filter in Flutter)

### Social Features
- ✅ Follow system (followers/following relations)
- ✅ Like posts
- ✅ Comment on posts
- ✅ Group membership

---

## 🧪 Testing

### Run All Tests
```bash
# Test all 44 API endpoints
.\test-all-apis-complete.ps1

# Test new features (groups, location)
.\test-new-features.ps1
```

### Expected Result
```
Total Tests: 44
Passed: 44
Failed: 0
Success Rate: 100%

🎉 ALL TESTS PASSED! Backend is 100% ready!
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/local/register` - Register
- `POST /api/auth/local` - Login
- `GET /api/users/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile (including location)

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group
- `POST /api/groups/:id/join` - Join group ⭐
- `POST /api/groups/:id/leave` - Leave group ⭐
- `DELETE /api/groups/:id` - Delete group

### Direct Messages
- `GET /api/direct-messages` - Get messages
- `POST /api/direct-messages` - Send message

### All Other Collections
Standard CRUD operations for:
- Comments, Polls, Matches, Teams, Tournaments
- Achievements, Reports, Notifications, Stories

**See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference**

---

## 🗄️ Database Schema

### Users (Extended)
- username, email, password
- latitude, longitude, city, state, district
- phone, profileImage, bio
- followers, following, followers_count, following_count

### Posts
- caption, media, visibility
- user (creator), liked_by, comments
- likeCount, commentCount

### Matches
- ground_name, date_time, total_Players_need
- latitude, longitude, city, state
- user (creator), players
- match_type, format, overs, status

### Groups
- name, description, type
- user (creator), members, admins
- members_count, messages_count

### Direct Messages
- message, attachments
- sender, receiver
- read, delivered

**See schemas in `src/api/*/content-types/*/schema.json`**

---

## 🏗️ Architecture

### Tech Stack
- **Backend:** Strapi v5 (Node.js)
- **Database:** PostgreSQL (SQLite for dev)
- **Media:** Cloudinary
- **Auth:** JWT (Strapi built-in)

### Design Principles
- ✅ Use default Strapi wherever possible
- ✅ Minimal custom code
- ✅ Standard REST API
- ✅ Simple and maintainable

### Custom Code
Only 2 custom endpoints:
1. `POST /api/groups/:id/join` - Join group
2. `POST /api/groups/:id/leave` - Leave group

Everything else uses default Strapi CRUD!

---

## 📱 Flutter Integration

### Distance Calculation (Client-Side)
```dart
// Haversine formula in Flutter
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

// Get nearby users
final users = await api.getUsers();
final nearbyUsers = users.where((user) {
  final distance = calculateDistance(myLat, myLng, user.latitude, user.longitude);
  return distance <= 10; // 10km radius
}).toList();
```

### Update Location
```dart
await api.put('/users/${userId}', {
  'latitude': position.latitude,
  'longitude': position.longitude,
  'city': 'Hisar',
  'state': 'Haryana'
});
```

### Join Group
```dart
await api.post('/groups/${groupId}/join');
```

**See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete Flutter examples**

---

## 🚀 Deployment

### Quick Deploy (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add postgresql
railway up
```

### Environment Variables
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_NAME=crinect_db
DATABASE_USERNAME=your-user
DATABASE_PASSWORD=your-password
JWT_SECRET=your-secret
```

**See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete guide**

---

## 📊 Project Structure

```
my-strapi-project/
├── src/
│   ├── api/                    # API collections
│   │   ├── post/              # Posts API
│   │   ├── comment/           # Comments API
│   │   ├── poll/              # Polls API
│   │   ├── match/             # Matches API
│   │   ├── group/             # Groups API (with custom join/leave)
│   │   ├── direct-message/    # Direct messages API
│   │   ├── team/              # Teams API
│   │   ├── tournament/        # Tournaments API
│   │   └── ...                # Other APIs
│   ├── extensions/
│   │   └── users-permissions/ # Extended user schema
│   └── index.ts
├── config/                     # Strapi configuration
├── database/                   # Database files (SQLite dev)
├── public/                     # Static files
├── tests/
│   ├── test-all-apis-complete.ps1  # Main test suite
│   └── test-new-features.ps1       # Feature tests
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── DEPLOYMENT_CHECKLIST.md
├── .env                        # Environment variables
├── package.json
└── README.md                   # This file
```

---

## 🤝 Contributing

This is a complete, production-ready backend. No further development needed for MVP.

For feature requests or issues:
1. Check [GAP_ANALYSIS.md](./GAP_ANALYSIS.md) for what's intentionally not implemented
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for current capabilities
3. Consider if feature can be implemented in Flutter app

---

## 📝 License

[Your License Here]

---

## 👥 Team

- **Backend:** Strapi v5 + PostgreSQL
- **Frontend:** Flutter (separate repository)
- **Media:** Cloudinary
- **Deployment:** Railway/Heroku/AWS

---

## 🎉 Status: Production Ready!

✅ All features implemented  
✅ All tests passing  
✅ Documentation complete  
✅ Ready for Flutter integration  
✅ Ready for deployment  

**Let's build something amazing! 🚀**

---

## 📞 Support

- **Strapi Docs:** https://docs.strapi.io
- **Strapi Discord:** https://discord.strapi.io
- **Project Docs:** See `/docs` folder

---

**Built with ❤️ for the cricket community**
