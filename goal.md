# 🏏 Crinect (CricketConnect)
### The Local Cricket Community App - Complete Technical Specification

---

## 🧠 Overview

**Crinect** is a comprehensive location-based cricket networking platform built with **Flutter + Strapi v5 + Hive + PostgreSQL** that connects local players, teams, organizers, and cricket enthusiasts.

It solves the everyday struggle of finding players, planning matches, tracking performance, and building a thriving local cricket community — all in one simple, offline-capable, and scalable platform.

### Tech Stack (Confirmed)
- **Frontend:** Flutter (iOS, Android)
- **Backend:** Strapi v5 (Headless CMS)
- **Database:** PostgreSQL
- **Cache/Offline:** Hive (Local Storage)
- **Media Storage:** Cloudinary
- **Authentication:** JWT (Strapi built-in)
- **Location:** Flutter Geolocator (lat/long only, no maps)
- **Notifications:** Firebase Cloud Messaging (FCM) - Optional

---

## 🚨 Problems We’re Solving

### 1️⃣ Hard to Find Players Nearby
- Players who love cricket don’t know who else nearby wants to play.  
- You rely on random WhatsApp groups or word-of-mouth.

### 2️⃣ Availability Chaos
- You never know who’s *actually* free to play this week.  
- Organizers must message everyone manually every weekend.

### 3️⃣ No Central Community Platform
- Cricket updates, photos, and discussions happen across fragmented groups.  
- There’s no dedicated place for local cricket engagement.

### 4️⃣ Scheduling is a Mess
- Matches are planned via chats with no central schedule.  
- No visibility of who’s available or confirmed.

### 5️⃣ No Player Profiles or Stats
- No structured way to know who’s a batsman, bowler, or all-rounder.  
- Players can’t showcase their experience or skill.

### 6️⃣ Communication Scattered
- Players use WhatsApp, Facebook, and calls — all disconnected.  
- New members can’t easily connect or find old messages.

### 7️⃣ Lack of Local Discovery
- You might have a player 1 km away but never know they exist.  
- No discovery system for local cricket communities.

### 8️⃣ No Digital Presence for Local Cricket
- Local matches and tournaments happen offline.  
- There’s no permanent record of games, stats, or players.

---

## ✅ Crinect’s Solutions

| Problem | Crinect Solution |
|----------|------------------|
| **Finding Players Nearby** | Uses GPS to show all players within 5–10 km radius. |
| **Availability Chaos** | Players toggle weekly availability (e.g., “Available for Sunday match”). |
| **No Central Platform** | Built-in social feed (photos, videos, match updates, highlights). |
| **Scheduling Mess** | Admins can create matches with time & venue; all players can RSVP. |
| **No Player Profiles** | Detailed profiles (role, style, matches played, bio). |
| **Scattered Communication** | Built-in group chat + 1:1 direct messaging between nearby players. |
| **No Local Discovery** | Nearby filter using location + offline caching with Hive. |
| **No Digital Presence** | Every match & post builds an online record of local cricket activity. |

---

## 🌍 In Simple Terms

Crinect brings **your local cricket scene online** by letting you:

- Discover nearby cricket players 👥  
- Create and join matches 🗓️  
- Share photos, highlights, and updates 📸  
- Chat directly with your local players 💬  
- Build a cricket identity with a personal profile 🏏  

---

## ⚙️ Core Features (MVP + Advanced)

### 🏡 Home Feed
- **Regional Feed System:** Local (20km), District, State, National
- **Content Types:** Posts, photos, videos, match highlights, polls
- **Interactions:** Like, comment, share, save
- **Filters:** Recent, Popular, Following
- **Infinite Scroll:** Pagination with lazy loading
- **Offline Support:** Cached feed with sync on reconnect

### 📍 Nearby Players Discovery
- **Radius Search:** 5km, 10km, 20km, 50km customizable
- **Distance Calculation:** Haversine formula using lat/long coordinates
- **Advanced Filters:**
  - Role (batsman, bowler, all-rounder, wicket-keeper)
  - Skill level (beginner, intermediate, advanced, professional)
  - Availability (today, this week, this month)
  - Age group
- **List View:** Sortable by distance, rating, matches played
- **Distance Display:** Shows "2.3 km away" for each player
- **Quick Actions:** Message, invite to match, view profile

### ✅ Availability Management
- **Weekly Calendar:** Set availability for each day
- **Time Slots:** Morning, afternoon, evening, night
- **Auto-expire:** Availability resets weekly
- **Notifications:** Alert nearby players when you're available
- **Bulk Actions:** "Available all weekend" quick toggle

### 🗓️ Match Scheduling & Management
- **Match Creation:**
  - Title, description, date/time, venue (text address)
  - Venue location (lat/long for distance calculation)
  - Match type (friendly, practice, tournament, league)
  - Format (T20, ODI, Test, Box Cricket, Tape Ball)
  - Overs, players per side
  - Entry fee (optional)
  - Skill level requirement
- **RSVP System:**
  - Going, Maybe, Can't Go
  - Waitlist for full matches
  - Show distance from user to venue
- **Team Selection:**
  - Manual team assignment
  - Captain selection
- **Match Day Features:**
  - Player check-in
  - Show venue address with distance

### 💬 Chat System
- **Group Chats:**
  - Auto-created regional groups (Local, District, State)
  - User-created teams/clubs
  - Match-specific chats
  - Admin controls (mute, kick, pin messages)
- **Direct Messages:**
  - 1-on-1 private chat
  - Media sharing (photos, videos via Cloudinary)
  - Message reactions
- **Offline Queue:** Messages sent when back online (Hive)
- **Moderation:** Report, block, mute users

### 👤 Comprehensive Player Profile
**Basic Info:**
- Name, username, photo, bio
- Age, gender, location (city, state)
- Phone, email (privacy controlled)

**Cricket Details:**
- Primary role (batsman, bowler, all-rounder, wicket-keeper)
- Secondary role (optional)
- Batting style (right-hand, left-hand)
- Bowling style (fast, medium, spin - off/leg)
- Playing experience (years)
- Skill level (self-rated + community-rated)

**Statistics:**
- Matches played
- Wins/losses
- Batting: Runs, average, strike rate, highest score
- Bowling: Wickets, economy, best figures
- Fielding: Catches, run-outs

**Achievements:**
- Badges (50+ matches, century scorer, 5-wicket haul)
- Trophies
- Man of the Match awards

**Social:**
- Followers/Following
- Teams joined
- Match history
- Photo gallery
- Video highlights

**Settings:**
- Privacy controls (who can see profile, contact info)
- Notification preferences
- Availability status

### 📱 Offline Mode (Hive Integration)
- **Cached Data:**
  - Player profiles (last 50 viewed)
  - Feed posts (last 100)
  - Match schedules (upcoming 30 days)
  - Chat messages (last 500 per conversation)
  - User's own profile and stats
- **Offline Actions:**
  - View cached content
  - Compose posts (auto-post when online)
  - Update availability
  - RSVP to matches
- **Sync Strategy:**
  - Background sync every 15 minutes
  - Manual pull-to-refresh
  - Conflict resolution for concurrent edits

### 🏆 Tournaments & Leagues
- **Tournament Creation:**
  - Name, format (knockout, round-robin, league)
  - Registration deadline
  - Prize pool
  - Sponsor logos
- **Team Registration:**
  - Team profiles with rosters
  - Captain assignment
  - Squad management
- **Bracket/Standings:**
  - Live tournament tree
  - Points table
  - Match fixtures
- **Live Updates:**
  - Score updates
  - Match results
  - Player of the tournament

### 📊 Statistics & Analytics
- **Personal Dashboard:**
  - Performance graphs (runs, wickets over time)
  - Comparison with peers
  - Improvement suggestions
- **Leaderboards:**
  - Regional rankings
  - Most runs, wickets, catches
  - Most active players
  - Best team players
- **Match Analytics:**
  - Win/loss patterns
  - Performance by venue
  - Best partnerships

### 🔔 Smart Notifications
- **Match Reminders:** 24h, 1h before match
- **Availability Alerts:** When nearby players are free
- **Chat Messages:** New messages in groups/DMs
- **Match Invites:** When someone invites you
- **Social:** Likes, comments, follows
- **System:** App updates, maintenance
- **Customizable:** Granular control over notification types

### 🎯 Gamification
- **XP System:** Earn points for activity
- **Levels:** Bronze, Silver, Gold, Platinum, Diamond
- **Badges:** Achievement unlocks
- **Streaks:** Consecutive days active
- **Challenges:** Weekly/monthly goals
- **Rewards:** Profile customization, premium features

### 🔍 Advanced Search
- **Players:** By name, location, role, skill
- **Matches:** By date, venue, type
- **Teams:** By name, location
- **Posts:** By content, hashtags, author
- **Tournaments:** By name, date, location

### 📸 Media Management
- **Photo Upload:** Profile, posts, match photos (via Cloudinary)
- **Video Upload:** Highlights, skills showcase (via Cloudinary)
- **Gallery:** Personal and team galleries
- **Compression:** Cloudinary auto-optimization
- **CDN:** Fast delivery via Cloudinary CDN

### 🛡️ Safety & Moderation
- **User Verification:** Phone/email verification
- **Reporting System:** Report inappropriate content/users
- **Blocking:** Block users from contacting you
- **Content Moderation:** AI + manual review
- **Privacy Controls:** Granular privacy settings
- **Age Restrictions:** 13+ with parental consent

---

## 🧭 App Flow

1. **Splash Screen** — Animated bat-hit intro  
2. **Login Screen** — Sign in via email or Google (Strapi Auth)  
3. **Home Feed** — Cricket posts, videos, updates  
4. **Players Screen** — Shows nearby players + distance  
5. **Match Schedule Screen** — List & create matches  
6. **Community Chat** — Group and 1-on-1 messages  
7. **Profile Screen** — View & edit player info  

---

---

## 📍 Location & Proximity System (No Maps Required)

### How It Works
1. **User Location Capture:**
   - Flutter Geolocator package gets user's current lat/long
   - User updates location manually or automatically
   - Location stored in Strapi user profile

2. **Distance Calculation:**
   - Backend uses **Haversine formula** to calculate distance between two lat/long points
   - Formula: `distance = 2 * R * asin(sqrt(sin²((lat2-lat1)/2) + cos(lat1) * cos(lat2) * sin²((lon2-lon1)/2)))`
   - R = Earth's radius (6371 km)

3. **Nearby Query Logic:**
   ```javascript
   // Strapi custom endpoint: /users/nearby
   // 1. Get user's lat/long
   // 2. Calculate bounding box (rough filter)
   const degreeRadius = radius / 111; // ~111 km per degree
   const minLat = userLat - degreeRadius;
   const maxLat = userLat + degreeRadius;
   const minLng = userLng - degreeRadius;
   const maxLng = userLng + degreeRadius;
   
   // 3. Query users within bounding box
   // 4. Calculate exact distance for each user
   // 5. Filter by exact radius and sort by distance
   ```

4. **Display in Flutter:**
   - Show list of nearby players with distance
   - "2.3 km away", "5.8 km away", etc.
   - No map visualization needed
   - Simple list with profile cards

### Benefits
- ✅ No Google Maps API costs
- ✅ No complex map UI
- ✅ Fast and simple
- ✅ Works offline (cached locations)
- ✅ Privacy-friendly (no exact addresses shown)

---

## 🧠 Regional Feed Segmentation System (Prevents Cross-State Chaos)

### 🚨 Problem
If all users from different states (Haryana, Punjab, Delhi, etc.) share one global feed → it becomes messy, irrelevant, and spammy.

---

### ✅ Solution — Multi-Level Feeds

#### **Level 1 — Local Feed (Default) 🏠**
- Shows posts, matches, and players within 20 km radius.  
- “Local Chat” group auto-created for nearby players.

#### **Level 2 — District Feed 🏙️**
- Shows posts from your city/district only (e.g., *Hisar*).  
- Optional district chat room (“Hisar Players”).

#### **Level 3 — State Feed 🌍**
- Curated content for tournaments, official events, and state updates.  
- Admins control visibility.

---

### 🧩 How It Works

- Each user stores `latitude`, `longitude`, `city`, and `state`.  
- Feed and chat queries filter by region:

---

### 🧱 Benefits
.gray-dotted-list
- 🏠 Local relevance (no cross-state noise)  
- 🔊 Less spam, faster load times  
- 🔐 Geo-segmented chats  
- 🌍 Easy scalability — city → district → state → nation  

---

## 💬 User-Created Groups + Private Chat System

### 🎯 Purpose
Let users form their own **teams, friend circles, or clubs** — each with its **own private chat** and optional match schedules.

---

### ⚙️ Group Structure

| Collection | Fields |
|-------------|---------|
| **groups** | `name`, `description`, `type (public/private/team)`, `created_by`, `members`, `city`, `state` |
| **group_messages** | `group`, `sender`, `message`, `timestamp`, `attachments` |

---

### 🔹 API Examples

- **Create Group:**  
Perfect — now we’re switching into backend task detailing mode for your Strapi backend 👨‍💻

Let’s clearly list all backend fixes, improvements, and new fields/tasks you (or Kiro) need to implement so that your Crinect app backend is complete and ready for real-world use.

🧠 BACKEND TASK LIST (STRAPI v5)

Below is a comprehensive task checklist grouped by each module.
All of this can be done in Strapi Admin → Content-Type Builder and via custom controllers where needed.

🧩 1️⃣ USERS COLLECTION (Base: plugin::users-permissions.user)

🧰 Add these new fields:

Field	Type	Description
username	String	Full name or nickname
phone	String	Player’s phone number
role_type	Enumeration (batsman, bowler, allrounder, keeper)	Player role
bio	Text	Short description
availability	Boolean	Ready to play (true/false)
city	String	User’s city
district	String	Optional, same as city
state	String	State name
region	Enumeration (local, district, state)	Current region filter
latitude	Float	GPS latitude
longitude	Float	GPS longitude
photo	Media (single)	Player profile image

✅ Purpose:
Needed for:

Regional feed filtering

Nearby players API

User profiles

🧩 2️⃣ MATCHES COLLECTION

🧰 Add/Modify Fields:

Field	Type	Description
title	String	Match title
description	Text	Optional
date	DateTime	Match time
venue	String	Place name
latitude	Float	Match location latitude
longitude	Float	Match location longitude
city	String	Match city
state	String	Match state
created_by	Relation (User)	Who scheduled it
players	Relation (many-to-many User)	Participants
available_count	Integer	Calculated total available players
match_type	Enum (friendly, tournament)	Optional

✅ Purpose:

Matches are visible in local/district feeds

Can filter by region easily

🧩 3️⃣ POSTS COLLECTION

🧰 Add/Modify Fields:

Field	Type	Description
content	Text	Post text
media	Media (multiple)	Photos/videos
author	Relation (User)	Post creator
city	String	Derived from author.city
state	String	Derived from author.state
latitude	Float	Derived from author.latitude
longitude	Float	Derived from author.longitude
visibility	Enum (local, district, state, public)	Post reach

✅ Purpose:

Region-based feed filtering

Local/district visibility control

🧩 4️⃣ POLLS COLLECTION

🧰 New Collection

Field	Type	Description
question	String	Poll question
options	JSON	Array of options (e.g. ["Saturday", "Sunday"])
created_by	Relation (User)	Poll creator
city	String	Creator’s city
state	String	Creator’s state
latitude	Float	Creator’s location
longitude	Float	Creator’s location
region	String	local, district, or state
responses	Relation (User-Poll)	Who voted
visibility	Enum (local, district, state)	Where visible

✅ Purpose:

Used for “Who’s free this Sunday?” votes

Visible only to nearby players

🧩 5️⃣ GROUPS COLLECTION

🧰 Add/Modify Fields:

Field	Type	Description
name	String	Group name
description	Text	Optional
type	Enum (public, private, team)	Access type
created_by	Relation (User)	Group owner
members	Many-to-many (User)	Group members
city	String	Auto from creator
state	String	Auto from creator
latitude	Float	Optional
longitude	Float	Optional
icon	Media	Group image

✅ Purpose:

Enables user-created groups by region

Auto-shows groups in “My Groups” tab

🧩 6️⃣ GROUP_MESSAGES COLLECTION

🧰 Fields:

Field	Type	Description
group	Relation (Group)	Linked group
sender	Relation (User)	Who sent message
message	Text	Message text
attachments	Media (optional)	Photo/video
timestamp	DateTime	Auto

✅ Purpose:

Core chat message store

Can extend later with sockets

🧩 7️⃣ USER LOCATION ENDPOINT

Custom Endpoint: /users/me/location

Updates user’s latitude, longitude, city, state.

// src/api/user/controllers/user.js
async updateLocation(ctx) {
  const user = ctx.state.user;
  const { latitude, longitude, city, state } = ctx.request.body;

  if (!latitude || !longitude) return ctx.badRequest('Missing coordinates');

  const updated = await strapi.db.query('plugin::users-permissions.user').update({
    where: { id: user.id },
    data: { latitude, longitude, city, state },
  });

  ctx.send(updated);
}


✅ Purpose:

Sync Flutter location → Strapi database

🧩 8️⃣ FIND NEARBY USERS ENDPOINT

Endpoint: /users/nearby

async findNearby(ctx) {
  const { latitude, longitude, radius = 10 } = ctx.query;
  if (!latitude || !longitude) return ctx.badRequest('Missing coordinates');

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const rad = parseFloat(radius);
  const degreeRadius = rad / 111; // ~111 km per degree

  const users = await strapi.db.query('plugin::users-permissions.user').findMany({
    where: {
      latitude: { $between: [lat - degreeRadius, lat + degreeRadius] },
      longitude: { $between: [lng - degreeRadius, lng + degreeRadius] },
    },
    select: ['id', 'username', 'role_type', 'city', 'state', 'latitude', 'longitude', 'photo'],
  });

  ctx.send(users);
}


✅ Purpose:

Enables Flutter “Nearby Players” screen

🧩 9️⃣ REGION-BASED FEED ENDPOINTS

Endpoints:

GET /posts/local?lat=29.15&lng=75.72&radius=20
GET /posts/city?city=Hisar
GET /posts/state?state=Haryana


Each filters posts by:

Distance (local)

City (district)

State (regional)

✅ Purpose:

Prevents Haryana/Punjab post chaos

Keeps feed relevant

🧩 🔟 ADMIN TASKS / CONFIGS
Task	Description
✅ Enable Media Uploads	For posts, profiles, and chat attachments
✅ Enable Roles & Permissions	Users → Authenticated can read/write posts
✅ Add CORS Origin	Allow your Flutter app domain / localhost
✅ Enable Email Plugin	For account verification
✅ Create Admin Panel Roles	State-level moderators
✅ Seed Data	Add dummy users for testing nearby feature
🧭 BACKEND COMPLETION CHECKLIST
Module	Task	Status
Users	Add city, state, location fields	⏳ Pending
Matches	Add created_by, location fields	⏳ Pending
Posts	Add author, region, location fields	⏳ Pending
Polls	Create new collection	⏳ Pending
Groups	Add relations + location	⏳ Pending
Group Messages	Create collection	⏳ Pending
APIs	/users/me/location, /users/nearby	⏳ Pending
Region Feeds	local, city, state filters	⏳ Pending
Admin Config	Roles, CORS, Media	⏳ Pending
✅ Final Result (After Completion)

Once these backend tasks are done:

Every user, post, match, poll, and group will have a creator, location, and region.

The app can filter feeds & chats cleanly (no cross-state chaos).

Players can discover, schedule, and chat regionally — smoothly, offline-ready, and scalable.

---


## 🚀 Implementation Roadmap (Simplified)

### Phase 1: Core MVP (Weeks 1-4)
**Goal:** Basic app with user profiles, nearby players, and posts

#### Backend (Strapi)
- [ ] Setup Strapi v5 + PostgreSQL
- [ ] Configure Cloudinary for media uploads
- [ ] Extend Users collection (location, cricket fields)
- [ ] Create Posts collection
- [ ] Create Matches collection
- [ ] Implement `/users/nearby` endpoint (Haversine distance)
- [ ] Implement `/posts/feed` endpoint (regional filtering)
- [ ] Setup JWT authentication
- [ ] Configure CORS for Flutter app

#### Frontend (Flutter)
- [ ] Setup Flutter project structure
- [ ] Implement authentication (login, register)
- [ ] Implement Geolocator for location
- [ ] Create user profile screen
- [ ] Create nearby players screen (list with distance)
- [ ] Create home feed screen
- [ ] Setup Hive for offline caching
- [ ] Integrate Cloudinary for image uploads

**Deliverable:** Users can register, see nearby players, and view posts

---

### Phase 2: Match & Availability (Weeks 5-6)
**Goal:** Match scheduling and availability system

#### Backend
- [ ] Add availability field to Users
- [ ] Implement `/matches/nearby` endpoint
- [ ] Implement `/matches/:id/rsvp` endpoint
- [ ] Add match participants tracking

#### Frontend
- [ ] Create match scheduling screen
- [ ] Create match details screen
- [ ] Implement RSVP functionality
- [ ] Add availability toggle
- [ ] Show match distance from user

**Deliverable:** Users can create matches, RSVP, and set availability

---

### Phase 3: Chat System (Weeks 7-8)
**Goal:** Group and direct messaging

#### Backend
- [ ] Create Groups collection
- [ ] Create Group_Messages collection
- [ ] Create Direct_Messages collection
- [ ] Implement group chat endpoints
- [ ] Implement DM endpoints
- [ ] Auto-create regional groups

#### Frontend
- [ ] Create chat list screen
- [ ] Create group chat screen
- [ ] Create direct message screen
- [ ] Implement message sending
- [ ] Add media sharing (Cloudinary)
- [ ] Offline message queue (Hive)

**Deliverable:** Users can chat in groups and send DMs

---

### Phase 4: Social Features (Weeks 9-10)
**Goal:** Likes, comments, follows

#### Backend
- [ ] Create Comments collection
- [ ] Create Likes/Follows relations
- [ ] Implement like/unlike endpoints
- [ ] Implement comment endpoints
- [ ] Implement follow/unfollow endpoints

#### Frontend
- [ ] Add like/comment UI to posts
- [ ] Create comments screen
- [ ] Add follow/unfollow buttons
- [ ] Show followers/following lists
- [ ] Add post creation with media

**Deliverable:** Full social interaction features

---

### Phase 5: Advanced Features (Weeks 11-12)
**Goal:** Polls, notifications, stats

#### Backend
- [ ] Create Polls collection
- [ ] Create Notifications collection
- [ ] Create Player_Stats collection
- [ ] Implement poll voting endpoints
- [ ] Implement notification system
- [ ] Add basic stats tracking

#### Frontend
- [ ] Create poll creation/voting UI
- [ ] Implement push notifications (FCM)
- [ ] Create player stats screen
- [ ] Add leaderboards
- [ ] Performance optimization

**Deliverable:** Complete feature set ready for testing

---

### Phase 6: Polish & Launch (Weeks 13-14)
**Goal:** Testing, bug fixes, deployment

- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] UI/UX polish
- [ ] Deploy Strapi to production
- [ ] Deploy PostgreSQL
- [ ] Setup Cloudinary production account
- [ ] Beta testing with real users
- [ ] Bug fixes
- [ ] App store submission

**Deliverable:** Production-ready app

---

## 🎯 Key Technical Decisions

### Why No Maps?
- **Cost:** Google Maps API is expensive at scale
- **Simplicity:** Lat/long + distance calculation is sufficient
- **Privacy:** Users don't need to see exact locations
- **Performance:** Faster than rendering maps
- **Offline:** Works better offline

### Why Hive?
- **Offline-first:** Perfect for mobile apps
- **Fast:** NoSQL key-value store
- **Lightweight:** No native dependencies
- **Type-safe:** Works well with Flutter

### Why Cloudinary?
- **Free tier:** Generous free plan
- **Auto-optimization:** Automatic image compression
- **CDN:** Fast global delivery
- **Transformations:** On-the-fly image resizing
- **Video support:** Handles videos too

### Why PostgreSQL?
- **Reliable:** Battle-tested database
- **Strapi default:** Works seamlessly with Strapi
- **Scalable:** Can handle millions of records
- **Geospatial:** Has PostGIS extension if needed later

---

## 📝 Critical Implementation Notes

### 1. Location Updates
```dart
// Flutter: Update location periodically
import 'package:geolocator/geolocator.dart';

Future<void> updateUserLocation() async {
  Position position = await Geolocator.getCurrentPosition();
  
  // Send to Strapi
  await api.put('/users/me/location', {
    'latitude': position.latitude,
    'longitude': position.longitude,
  });
  
  // Cache locally
  await Hive.box('user').put('latitude', position.latitude);
  await Hive.box('user').put('longitude', position.longitude);
}
```

### 2. Distance Calculation (Strapi)
```javascript
// Haversine formula implementation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
```

### 3. Nearby Users Query (Strapi)
```javascript
// src/api/user/controllers/user.js
async findNearby(ctx) {
  const { latitude, longitude, radius = 10 } = ctx.query;
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const rad = parseFloat(radius);
  
  // Rough bounding box filter (performance optimization)
  const degreeRadius = rad / 111;
  
  const users = await strapi.db.query('plugin::users-permissions.user').findMany({
    where: {
      latitude: { $gte: lat - degreeRadius, $lte: lat + degreeRadius },
      longitude: { $gte: lng - degreeRadius, $lte: lng + degreeRadius },
    },
  });
  
  // Calculate exact distance and filter
  const nearbyUsers = users
    .map(user => ({
      ...user,
      distance: calculateDistance(lat, lng, user.latitude, user.longitude)
    }))
    .filter(user => user.distance <= rad)
    .sort((a, b) => a.distance - b.distance);
  
  return nearbyUsers;
}
```

### 4. Offline Caching Strategy (Flutter)
```dart
// Cache strategy
class CacheManager {
  // Cache nearby players
  static Future<void> cacheNearbyPlayers(List players) async {
    final box = await Hive.openBox('nearby_players');
    await box.put('players', players);
    await box.put('cached_at', DateTime.now().toIso8601String());
  }
  
  // Get cached players if fresh (< 15 minutes old)
  static Future<List?> getCachedPlayers() async {
    final box = await Hive.openBox('nearby_players');
    final cachedAt = box.get('cached_at');
    
    if (cachedAt != null) {
      final cacheTime = DateTime.parse(cachedAt);
      final now = DateTime.now();
      
      if (now.difference(cacheTime).inMinutes < 15) {
        return box.get('players');
      }
    }
    return null;
  }
}
```

---

## ✅ Success Metrics

### Technical Metrics
- [ ] App loads in < 2 seconds
- [ ] Nearby search completes in < 1 second
- [ ] 95% of requests succeed
- [ ] Offline mode works seamlessly
- [ ] Images load in < 500ms (Cloudinary CDN)

### User Metrics
- [ ] 100+ active users in first month
- [ ] 50+ matches created per week
- [ ] 500+ posts per week
- [ ] Average session time > 5 minutes
- [ ] User retention > 40% after 30 days

### Business Metrics
- [ ] Infrastructure cost < $50/month (Strapi + PostgreSQL + Cloudinary free tiers)
- [ ] Zero map API costs
- [ ] Scalable to 10,000+ users without major changes

---

## 🎉 Summary

Crinect is a **lean, focused cricket community app** that solves real problems for local players:

✅ **Simple Tech Stack:** Flutter + Strapi + PostgreSQL + Cloudinary + JWT  
✅ **No Unnecessary Complexity:** No maps, no Redis, no microservices  
✅ **Offline-First:** Hive caching for seamless experience  
✅ **Cost-Effective:** Free tiers for everything  
✅ **Scalable:** Can grow to thousands of users  
✅ **Privacy-Friendly:** No exact addresses, just distances  
✅ **Feature-Rich:** Everything needed for local cricket community  

**Total Development Time:** 12-14 weeks for full MVP  
**Monthly Cost:** < $50 (can start completely free)  
**Target Users:** Local cricket players in India  

Ready to build! 🏏
