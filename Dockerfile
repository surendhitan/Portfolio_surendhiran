# ═══════════════════════════════════════════════════════
#  STAGE 1 — Build (copy + validate assets)
# ═══════════════════════════════════════════════════════
FROM nginx:alpine AS builder

# Install only what we need
RUN apk add --no-cache curl

# Copy all static site files
COPY index.html  /usr/share/nginx/html/index.html
COPY style.css   /usr/share/nginx/html/style.css
COPY app.js      /usr/share/nginx/html/app.js
COPY profile.jpg /usr/share/nginx/html/profile.jpg

# Validate files are there
RUN ls -lah /usr/share/nginx/html/

# ═══════════════════════════════════════════════════════
#  STAGE 2 — Production Image
# ═══════════════════════════════════════════════════════
FROM nginx:alpine

LABEL maintainer="Surendhiran A"
LABEL description="Portfolio — https://surendhiran.dev.com"
LABEL version="2.0"

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl && chmod 700 /etc/nginx/ssl

# Copy static files from builder stage
COPY --from=builder /usr/share/nginx/html /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy TLS certificates
COPY ssl/surendhiran.dev.com.crt /etc/nginx/ssl/surendhiran.dev.com.crt
COPY ssl/surendhiran.dev.com.key /etc/nginx/ssl/surendhiran.dev.com.key

# Lock down cert permissions
RUN chmod 644 /etc/nginx/ssl/surendhiran.dev.com.crt && \
    chmod 600 /etc/nginx/ssl/surendhiran.dev.com.key

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf.bak

# Health check — ping HTTP (nginx redirect) endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -fsk https://localhost/ || exit 1

# Expose ports
EXPOSE 80 443

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
