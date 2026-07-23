#!/bin/bash
MKCERT="/home/suren/.local/bin/mkcert"
SSL_DIR="/mnt/c/Users/suren/Dropbox/Dacuments/Study Metirials/potpolio_12/ssl"
PROJECT="/mnt/c/Users/suren/Dropbox/Dacuments/Study Metirials/potpolio_12"
DOMAIN="surendhiran.dev.com"

echo "=== Generating SSL cert for $DOMAIN ==="
cd "$SSL_DIR"
# Remove old certs
rm -f surendar.dev.* surendhiran.dev.com.*
# Generate new cert
$MKCERT -cert-file ${DOMAIN}.crt -key-file ${DOMAIN}.key \
  "$DOMAIN" "www.$DOMAIN" 127.0.0.1 localhost

echo "Certs:"
ls -lh "$SSL_DIR"

echo ""
echo "=== Rebuilding Docker ==="
cd "$PROJECT"
docker stop portfolio_app 2>/dev/null || true
docker rm   portfolio_app 2>/dev/null || true
docker build -t portfolio:latest .
docker run -d --name portfolio_app \
  -p 80:80 -p 443:443 \
  --restart unless-stopped \
  portfolio:latest

echo ""
echo "=== DONE ==="
docker ps --filter name=portfolio_app --format "{{.Status}} | {{.Ports}}"
echo ""
echo " Open → https://$DOMAIN  or  https://127.0.0.1"
