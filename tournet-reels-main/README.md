# TourNet — Reels Module

**Discover. Share. Travel.**

Phase 1 of the TourNet B.Tech major project: a full-stack, tourism-focused
short-video (Reels) platform, built to be extended later with trip
journals, scam alerts, fake-review detection, and group events.

---

## 1. Project overview

TourNet Reels is a vertical short-video feed, in the spirit of Instagram
Reels / LinkedIn's video feed, focused entirely on travel content. Users
can browse an auto-playing reel feed, like, comment, share, save, follow
creators, and upload their own travel reels.

## 2. Features

- JWT authentication (register / login / protected routes)
- Vertical scroll-snap reel feed with **one-video-at-a-time autoplay**
  (IntersectionObserver-driven), mute/unmute, tap to play/pause
- Like / unlike with optimistic UI updates
- Comment panel (add / delete own comments)
- Share (Web Share API, WhatsApp, copy link) + deep-linkable `/reels/:id`
- Save / bookmark reels + a dedicated Saved page
- Reel upload (video → Cloudinary, metadata → MySQL) with progress bar
- Delete your own reels
- Creator profiles with follow / unfollow and a reel grid
- Basic search/explore by caption, hashtag, location, or creator
- Infinite-scroll pagination on the main feed
- Responsive design: full-viewport mobile feed, centered card on desktop

## 3. Tech stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, Lucide React
**Backend:** Node.js, Express, REST API
**Database:** MySQL (via `mysql2`)
**Auth:** JWT + bcrypt
**Media storage:** Cloudinary (videos, thumbnails, avatars)

## 4. Folder structure

```
tournet-reels/
├── frontend/          React + Vite app
│   └── src/
│       ├── components/  Reusable UI (ReelCard, VideoPlayer, Navbar, ...)
│       ├── pages/        Route-level views (ReelsPage, UploadReel, ...)
│       ├── hooks/        useAuth, useReels, useVideoAutoplay, useLike, useComments
│       ├── context/      AuthContext, ToastContext
│       ├── services/     api.js (axios), authService, reelService
│       └── utils/
├── backend/           Express REST API
│   ├── controllers/    Request handlers
│   ├── routes/          Route definitions
│   ├── models/           SQL data-access layer
│   ├── middleware/     auth, upload, error handling
│   ├── services/         cloudinaryService
│   ├── config/            db.js, cloudinary.js
│   └── server.js
├── database/
│   └── schema.sql      Full MySQL schema
├── .env.example (per app)
└── package.json        Root scripts (runs both servers together)
```

## 5. Installation

Prerequisites: Node.js 18+, a running MySQL server, and a free
[Cloudinary](https://cloudinary.com) account.

```bash
git clone <your-repo-url> tournet-reels
cd tournet-reels
npm run install:all
```

This installs dependencies for the root, `backend/`, and `frontend/`.

## 6. Environment variables

Copy the example files and fill in your own values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**backend/.env**

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=tournet

JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**frontend/.env**

```
VITE_API_URL=http://localhost:5000/api
```

Never commit real `.env` files — only `.env.example` is tracked.

## 7. MySQL setup

```bash
mysql -u root -p < database/schema.sql
```

This creates the `tournet` database and all tables (`users`, `reels`,
`likes`, `comments`, `saved_reels`, `follows`) with proper foreign keys,
unique constraints, and indexes.

## 8. Cloudinary setup

1. Create a free account at cloudinary.com.
2. From the dashboard, copy your **Cloud name**, **API key**, and
   **API secret** into `backend/.env`.
3. No further configuration needed — uploads are streamed directly from
   the backend using the `cloudinary` SDK (`backend/services/cloudinaryService.js`).

## 9. Backend setup

```bash
cd backend
npm install        # already done if you ran install:all
npm run dev         # starts the API on http://localhost:5000 with nodemon
```

Optional — seed demo data (5 users, 10 reels, likes/comments/follows):

```bash
npm run seed
```

Demo login for any seeded user: their email (e.g. `rahul@tournet.demo`)
with password `password123`.

## 10. Frontend setup

```bash
cd frontend
npm install         # already done if you ran install:all
npm run dev          # starts Vite dev server on http://localhost:5173
```

## 11. How to run locally (both at once)

From the project root:

```bash
npm run dev
```

This uses `concurrently` to start the backend (port 5000) and frontend
(port 5173) together, with labeled, color-coded logs.

Then open **http://localhost:5173** and either register a new account
or log in with a seeded demo user.

## 12. API documentation

All responses follow a consistent shape:

```json
{ "success": true,  "message": "...", "data": { ... } }
{ "success": false, "message": "...", "errors": null }
```

**Auth**
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account, returns token |
| POST | `/api/auth/login` | – | Log in, returns token |
| GET | `/api/auth/me` | ✅ | Current user |

**Reels**
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/reels?page=&limit=` | optional | Paginated feed |
| GET | `/api/reels/search?q=` | optional | Search reels |
| GET | `/api/reels/:id` | optional | Single reel |
| POST | `/api/reels` (multipart, field `video`) | ✅ | Upload reel |
| DELETE | `/api/reels/:id` | ✅ (owner) | Delete reel |
| POST/DELETE | `/api/reels/:id/like` | ✅ | Like / unlike |
| GET | `/api/reels/:id/likes` | – | List likers |
| POST/DELETE | `/api/reels/:id/save` | ✅ | Save / unsave |
| GET | `/api/reels/:id/comments` | – | List comments |
| POST | `/api/reels/:id/comments` | ✅ | Add comment |

**Comments**
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| DELETE | `/api/comments/:commentId` | ✅ (owner) | Delete a comment |

**Users / profile / follow / saved**
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me/saved` | ✅ | My saved reels |
| POST | `/api/users/me/avatar` (multipart, field `image`) | ✅ | Update avatar |
| GET | `/api/users/:username` | optional | Public profile |
| GET | `/api/users/:username/reels` | optional | That user's reels |
| POST/DELETE | `/api/users/:id/follow` | ✅ | Follow / unfollow |
| GET | `/api/users/:id/followers` | – | Followers list |
| GET | `/api/users/:id/following` | – | Following list |

## 13. How the autoplay feed works

Each `ReelCard` observes its own container with `IntersectionObserver`
(via `useVideoAutoplay`). When a card crosses the 60% visibility
threshold it reports itself "active" to the parent `ReelFeed`, which
tracks a single `activeId`. Only the reel whose id matches `activeId`
plays; every other `<video>` is paused and reset. Combined with
`scroll-snap-type: y mandatory` on the feed container, this gives the
"one reel plays, previous pauses" behaviour required by the spec.

## 14. Future improvements

- Recommendation-aware feed ranking (watch time, location/interest signals)
- Trip journals, scam alerts, fake review/influencer detection, group events
- Real-time comment updates (WebSockets)
- Video compression/transcoding pipeline before Cloudinary upload
- Full-text search (MySQL FULLTEXT index or a dedicated search service)
- Push notifications for likes/comments/follows
