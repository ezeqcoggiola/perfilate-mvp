# Multi-stage Dockerfile for building a Vite React app and serving with nginx

# Stage 1: build the app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install in the context of the perfilate app
COPY perfilate/package.json perfilate/package-lock.json ./perfilate/
WORKDIR /app/perfilate
RUN npm ci --silent

# Copy rest of the app
COPY perfilate/ ./

# Build the production bundle
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config template
COPY docker/app.conf.template /etc/nginx/conf.d/app.conf.template

# Copy built files from builder
COPY --from=builder /app/perfilate/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Run nginx in foreground
## At runtime replace ${PORT} in the nginx template with the actual PORT env var (Render provides $PORT)
CMD ["/bin/sh", "-lc", ": ${PORT:=80} ; export PORT ; envsubst '$$PORT' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/app.conf && nginx -g 'daemon off;'" ]
