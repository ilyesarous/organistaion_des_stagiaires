# Stage 1: Build the React (Vite) application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build React app with Vite
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
