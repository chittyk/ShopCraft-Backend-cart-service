# Use Node.js official image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files into container
COPY . .

# Expose the port your app runs on
EXPOSE 8085

# Command to run your app
CMD ["npm", "run", "dev"]


