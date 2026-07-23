#!/bin/bash
set -e
PROJECT="/mnt/c/Users/suren/Dropbox/Dacuments/Study Metirials/potpolio_12"
export PATH="$HOME/.local/bin:$PATH"

echo ""
echo "======================================"
echo "  Portfolio Deploy - Docker + K8s"
echo "======================================"

# ── Step 1: Check Docker ────────────────────
echo ""
echo "[1/4] Checking Docker..."
if docker ps > /dev/null 2>&1; then
  echo "✅ Docker OK: $(docker --version)"
else
  echo "⚠️  Adding user to docker group & retrying..."
  # Use newgrp trick
  exec sg docker "bash '$0'"
fi

# ── Step 2: Install kubectl (no sudo) ───────
echo ""
echo "[2/4] Installing kubectl v1.31.0..."
mkdir -p ~/.local/bin
if [ ! -f ~/.local/bin/kubectl ]; then
  curl -sLo ~/.local/bin/kubectl "https://dl.k8s.io/release/v1.31.0/bin/linux/amd64/kubectl"
  chmod +x ~/.local/bin/kubectl
fi
echo "✅ $(kubectl version --client 2>/dev/null | head -1)"

# ── Step 3: Install minikube (no sudo) ──────
echo ""
echo "[3/4] Installing minikube..."
if [ ! -f ~/.local/bin/minikube ]; then
  curl -sLo ~/.local/bin/minikube "https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64"
  chmod +x ~/.local/bin/minikube
fi
echo "✅ $(minikube version 2>/dev/null | head -1)"

# ── Step 4: Build & Run Docker container ────
echo ""
echo "[4/4] Building & running portfolio Docker container..."
cd "$PROJECT"
docker build -t portfolio:latest .
docker stop portfolio_app 2>/dev/null && docker rm portfolio_app 2>/dev/null || true
docker run -d --name portfolio_app -p 3000:80 --restart unless-stopped portfolio:latest
echo "✅ Portfolio container running!"

# ── Step 5: Deploy to Kubernetes ────────────
echo ""
echo "[5/5] Starting minikube and deploying to Kubernetes..."
minikube start --driver=docker --force
kubectl apply -f "$PROJECT/k8s/deployment.yaml"
echo "⏳ Waiting for pods to be Ready..."
kubectl wait --for=condition=ready pod -l app=portfolio --timeout=120s || true
kubectl get pods -o wide

echo ""
echo "======================================"
echo "✅  DEPLOYMENT COMPLETE!"
echo ""
echo "  🐳 Docker  → http://localhost:3000"
K8S=$(minikube service portfolio-service --url 2>/dev/null | head -1)
echo "  ☸️  K8s     → ${K8S:-'run: minikube service portfolio-service --url'}"
echo "======================================"
