# PackWise AI - Production Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source files
COPY . .

# Build Vite client assets
RUN npm run build

# Expose server port 3000
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Start Express full-stack monolith
CMD ["npm", "start"]
