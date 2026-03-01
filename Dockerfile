# ─────────────────────────────────────────────
# STAGE 1: Build the React app
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files
COPY . .

# Build production bundle
RUN npm run build

# ─────────────────────────────────────────────
# STAGE 2: Serve with Nginx (lightweight)
# ─────────────────────────────────────────────
FROM nginx:alpine

# Copy built files from Stage 1
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
