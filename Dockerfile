FROM node:18-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy backend
COPY backend/ ./backend/

# Copy frontend
COPY frontend/ ./frontend/

# Install dependencies for all
RUN npm install && \
    npm install --prefix backend && \
    npm install --prefix frontend

# Build frontend
RUN npm --prefix frontend run build

# Expose port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start backend
CMD ["npm", "--prefix", "backend", "start"]
