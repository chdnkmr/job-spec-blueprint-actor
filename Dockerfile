FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY src ./src
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Remove dev dependencies for production
RUN npm ci --only=production && npm cache clean --force

# Run the actor
CMD ["npm", "start"]
