# Step 1: Build the React app
FROM node:20 AS build

# Set working directory for the build stage
WORKDIR /app

# Copy the package.json files for React and install dependencies
COPY client/package*.json ./client/
RUN npm install --prefix client

# Copy the React source code and build the app
COPY client/ ./client
RUN npm run build --prefix client

# Step 2: Set up the Express server with TypeScript
FROM node:20

# Set working directory for the server
WORKDIR /app

# Copy server package.json and install dependencies
COPY server/package*.json ./server/
RUN npm install --prefix ./server

# Copy the tsconfig.json to the container
COPY server/tsconfig.json ./server/tsconfig.json

# Copy the TypeScript source code to the container
COPY server/src ./server/src

# Install TypeScript globally (if it's not already a dependency in your package.json)
RUN npm install -g typescript

# Compile TypeScript into JavaScript (into the dist/ folder)
RUN tsc --project server/tsconfig.json

# Copy the built React app from the build stage into the server's build folder
COPY --from=build /app/client/build ./client/build

# Expose port for the Express server
ENV PORT=5000
EXPOSE 5000

# Start the server (point to the compiled JavaScript entry point)
CMD ["node", "server/dist/index.js"]
