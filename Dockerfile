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

# Set VITE_API_URL at build time (default to localhost)
ARG VITE_API_URL=https://mushroom-identification-backend-954531306961.us-central1.run.app
ENV VITE_API_URL=$VITE_API_URL

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
