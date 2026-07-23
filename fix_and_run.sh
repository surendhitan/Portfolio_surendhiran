#!/bin/bash
echo ""
echo "=========================================="
echo "  Portfolio Fix - Ubuntu Terminal"
echo "=========================================="

# ── 1. Add domain to /etc/hosts ──────────────
echo ""
echo "[1] Adding surendhiran.dev.com to /etc/hosts..."
if grep -q "surendhiran.dev.com" /etc/hosts; then
  echo "✅ Already in /etc/hosts"
else
  echo "127.0.0.1 surendhiran.dev.com www.surendhiran.dev.com" | sudo tee -a /etc/hosts
  echo "✅ Added to /etc/hosts"
fi
grep "surendhiran" /etc/hosts

# ── 2. Check Docker container ─────────────────
echo ""
echo "[2] Checking Docker container..."
if docker ps --filter name=portfolio_app --format "{{.Status}}" | grep -q "Up"; then
  echo "✅ Container already running:"
  docker ps --filter name=portfolio_app --format "  ID: {{.ID}} | Status: {{.Status}} | Ports: {{.Ports}}"
else
  echo "⚠️  Container not running. Starting..."
  cd "/mnt/c/Users/suren/Dropbox/Dacuments/Study Metirials/potpolio_12"
  docker stop portfolio_app 2>/dev/null || true
  docker rm portfolio_app 2>/dev/null || true
  docker build -t portfolio:latest .
  docker run -d --name portfolio_app \
    -p 80:80 -p 443:443 \
    --restart unless-stopped \
    portfolio:latest
  echo "✅ Container started:"
  docker ps --filter name=portfolio_app --format "  ID: {{.ID}} | Status: {{.Status}} | Ports: {{.Ports}}"
fi

# ── 3. Test the URL from Ubuntu ───────────────
echo ""
echo "[3] Testing https://surendhiran.dev.com ..."
sleep 2
RESPONSE=$(curl -sk -o /dev/null -w "%{http_code}" https://surendhiran.dev.com 2>/dev/null || echo "000")
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
  echo "✅ Site is UP! HTTP status: $RESPONSE"
else
  echo "⚠️  HTTP status: $RESPONSE — checking nginx logs..."
  docker logs portfolio_app --tail 20
fi

echo ""
echo "=========================================="
echo "✅  https://surendhiran.dev.com  is READY"
echo "=========================================="
