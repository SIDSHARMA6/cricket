Strapi backend — Render deployment guide

Overview

This repository contains a Strapi v5 backend configured for an Instagram-style cricket app. It includes realtime chat (Socket.IO) and basic content-types for posts, stories, comments, likes, matches, player profiles, and polls.

Quick checklist for deploying to Render

1) Database (use managed Postgres)
- On Render, create a Postgres database and set the following env vars in your service:
  - DATABASE_CLIENT=postgres
  - DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD
  - or set DATABASE_URL (connection string) and set DATABASE_CLIENT=postgres

2) Secrets (must be set)
- APP_KEYS - comma-separated random values (keep secret)
- JWT_SECRET - used by auth tokens
- ADMIN_JWT_SECRET - admin panel JWT secret
- API_TOKEN_SALT, TRANSFER_TOKEN_SALT, ENCRYPTION_KEY

3) Build & Start commands (Render service settings)
- Build Command: npm run build
- Start Command: npm run start
- Alternatively, Render will respect the Procfile (web: npm run start)

4) Storage for media (recommended)
- Local uploads are stored on the instance (ephemeral). Use a cloud storage provider in production:
  - Cloudinary (provider: @strapi/provider-upload-cloudinary)
  - AWS S3 (provider: @strapi/provider-upload-aws-s3)
- After adding the provider package, configure it in `config/plugins.ts` with env vars.

5) Realtime chat and scaling
- Socket.IO is initialized in `src/index.ts`. It authenticates sockets with the same JWT used by Strapi (send as `auth.token` in handshake).
- For multi-instance setups, configure Redis and set `REDIS_URL` in Render. Install these packages when you enable Redis:
  - redis
  - @socket.io/redis-adapter

6) CORS
- Configure `CORS_ORIGIN` env var to restrict allowed origins (defaults to `*`). The middleware is in `config/middlewares.ts`.

7) Environment variables summary (minimum):
- HOST=0.0.0.0
- PORT=1337
- DATABASE_CLIENT=postgres
- DATABASE_URL or DATABASE_HOST/DATABASE_NAME/DATABASE_USERNAME/DATABASE_PASSWORD
- APP_KEYS (comma separated)
- JWT_SECRET
- ADMIN_JWT_SECRET
- API_TOKEN_SALT
- TRANSFER_TOKEN_SALT
- ENCRYPTION_KEY
- CORS_ORIGIN (optional)
- REDIS_URL (optional for socket scaling)

Recommended Render configuration

- Create a Web Service in Render using the repo.
- Set Build Command: npm run build
- Set Start Command: npm run start
- Set Environment: Node 18 (or 20) to match engines in package.json.
- Add the environment variables described above.

Extras and improvements to consider

- Use managed Postgres for persistent data and backups.
- Move media to Cloud storage and configure the upload provider.
- Add Redis (managed Redis) and enable socket.io redis adapter for horizontal scaling.
- Add rate-limiting middleware or use a reverse proxy to protect chat endpoints.
- Add monitoring (Sentry) and logging aggregation.

How to test locally

1) Install and run:

```powershell
Set-Location -Path 'D:\cricknetweb\backend'
npm install
npm run develop
```

2) Create admin at http://localhost:1337/admin
3) Register a user via Strapi auth endpoints and use the returned JWT in the Socket.IO client handshake `auth.token`.

If you want, I can:
- Add a `config/plugins.ts` example for Cloudinary or S3.
- Add a `Dockerfile` and `render.yaml` for container deployment on Render.
- Add Redis adapter packages and wire them into the project so you can enable multi-instance scaling immediately.

Next step? Tell me which of the extras you want me to implement automatically (Dockerfile, Cloudinary config, Redis adapter install and wiring, or more controllers/endpoints).