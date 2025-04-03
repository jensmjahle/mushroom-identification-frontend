# Use Debian-based Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the app using Vite
RUN npm run build

# Install a static file server for production
RUN npm install -g serve

# Use the correct working directory for production output
WORKDIR /app/dist

# Expose the port Cloud Run will send traffic to
EXPOSE 8080

# Run the static server with single-page app (SPA) fallback enabled
CMD ["serve", "-s", ".", "-l", "8080"]
