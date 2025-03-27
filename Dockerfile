# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source and build it
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

# Install a lightweight static server
RUN npm install -g serve

WORKDIR /app

# Copy built app from previous stage
COPY --from=builder /app/dist .

# Cloud Run requires the container to listen on $PORT
ENV PORT=8080

# Expose the required port
EXPOSE 8080

# Serve the built static files
CMD ["serve", "-s", ".", "-l", "8080"]
