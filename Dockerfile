# --- Builder Stage ---
FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Vite app
RUN npm run build

# --- Production Stage ---
FROM node:18-slim

# Install serve for static file hosting
RUN npm install -g serve

WORKDIR /app

# Copy built app
COPY --from=builder /app/dist ./

# Script that injects environment variables into env.js
COPY ./runtime-env.sh /app/runtime-env.sh
RUN chmod +x /app/runtime-env.sh

# Default fallback env.js file (optional, dev/debug)
RUN echo "window.env = {};" > /app/env.js

# Expose port
EXPOSE 8080

# Entry point: generate env.js and serve app
CMD ["/bin/sh", "-c", "./runtime-env.sh && serve -s . -l 8080"]
