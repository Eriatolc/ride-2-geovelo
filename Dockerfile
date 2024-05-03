# Stage 1: Build the application
FROM node:lts-alpine AS build

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Remove useless dependencies
RUN npm ci --production

# Stage 2: Create the lightweight image
FROM alpine:latest

# Install node on the Alpine image
RUN apk add nodejs --no-cache

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY LICENSE ./

# Copy only the built application code
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Command to run the application
CMD ["node", "./dist/src/app.js"]
