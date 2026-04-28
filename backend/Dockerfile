# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Create uploads directory for storing images
RUN mkdir -p uploads

# Expose backend port
EXPOSE 3001

# Start the server
CMD ["node", "index.js"]
