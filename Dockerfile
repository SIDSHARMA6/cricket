FROM node:18-alpine

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
