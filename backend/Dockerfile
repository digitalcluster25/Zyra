FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Run migrations and seed data
RUN npm run migrate
RUN npm run seed

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
