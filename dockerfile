# Step 1: Build the React app
FROM node:18 as build

# Set working directory for the build stage
WORKDIR /app

# Copy the package.json file of the client and install dependencies
COPY client/package*.json ./client/
RUN npm install --prefix client

# Copy client source code and build the React app
COPY client/ ./client
RUN npm run build --prefix client

# Step 2: Set up the Express server
FROM node:18

# Set working directory for the server
WORKDIR /app

# Copy server files (including dist)
COPY server/dist ./server/dist
COPY server/src ./server/src
COPY server/package*.json ./server/

# Install server dependencies
RUN npm install --prefix ./server

# Copy the built React app into the Express server directory
COPY --from=build /app/client/build ./client/build

# Expose port for Express server
ENV PORT=5000
EXPOSE 5000

# Start the server
CMD ["node", "server/dist/index.js"]
