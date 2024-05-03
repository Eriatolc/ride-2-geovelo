# Stage 1: Build the application
FROM node:lts-alpine AS build

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the lightweight image
FROM node:lts-alpine

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy only the built application code
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/LICENCE ./

# Install only production dependencies
RUN npm install --production

# Command to run the application
CMD ["npm", "start"]
