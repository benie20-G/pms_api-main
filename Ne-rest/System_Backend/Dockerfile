# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app (if using TypeScript)
# RUN npm run build

# Expose the port your app runs 
EXPOSE 4040

# Start the application
CMD ["npm", "run", "dev"]