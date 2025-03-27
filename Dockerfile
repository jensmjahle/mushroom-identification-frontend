# Use Debian-based Node.js image instead of Alpine
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Clean install
RUN npm ci

# Copy source files
COPY . .

# Build the Vite app
RUN npm run build

# Install a simple static file server
RUN npm install -g serve

# Set working directory for production
WORKDIR /app/dist

# Expose the port Cloud Run expects
EXPOSE 8080

# Run the static server on the required port
CMD ["serve", "-l", "8080", "."]
