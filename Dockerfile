FROM node:18-alpine

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build Strapi admin
RUN npm run build

ENV NODE_ENV=production
ENV PORT=1337

EXPOSE 1337

CMD ["npm", "run", "start"]
