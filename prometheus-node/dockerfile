# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY prometheus-node/package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY prometheus-node/ .

# Expose the port your app runs on
EXPOSE 9100

# Command to run the application
CMD ["node", "server.js"]