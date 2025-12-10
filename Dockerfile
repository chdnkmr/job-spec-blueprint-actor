FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY dist ./dist
COPY src ./src

# Run the actor
CMD ["npm", "start"]
