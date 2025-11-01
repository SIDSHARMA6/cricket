# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

### Render Deployment

This project is configured for deployment on Render with PostgreSQL database.

#### Prerequisites

1. Create a Render account at [render.com](https://render.com)
2. Generate production environment variables

#### Environment Variables Setup

Generate secure keys for production:

```bash
# Generate random strings for these variables:
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-random-string
ADMIN_JWT_SECRET=your-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-salt
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

#### Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Create a PostgreSQL database service on Render
4. Create a web service using the `render.yaml` configuration
5. Set the required environment variables in Render dashboard
6. Deploy!

#### Manual Deployment

Alternatively, you can deploy manually:

```bash
npm run build
npm start
```

For other deployment options, browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment).

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
