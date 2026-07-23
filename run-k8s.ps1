#!/usr/bin/env pwsh
# ════════════════════════════════════════════════════════════
#  run-k8s.ps1 — Deploy Portfolio to Kubernetes (Minikube)
#  Domain  : https://surendhiran.dev.com
#  Stack   : Docker + Kubernetes + Nginx + TLS/SSL
# ════════════════════════════════════════════════════════════

param(
  [switch]$Clean,      # --Clean : tear down and rebuild everything
  [switch]$Status,     # --Status: show pod/service/ingress status only
  [switch]$Logs        # --Logs  : tail logs from all pods
)

$ErrorActionPreference = "Stop"
$NAMESPACE   = "portfolio"
$IMAGE       = "portfolio:latest"
$DOMAIN      = "surendhiran.dev.com"
$CERT        = "ssl\surendhiran.dev.com.crt"
$KEY         = "ssl\surendhiran.dev.com.key"
$K8S_DIR     = "k8s"

function Write-Banner {
  Write-Host ""
  Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
  Write-Host "║   🚀  Portfolio K8s Deploy — surendhiran.dev.com     ║" -ForegroundColor Cyan
  Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
  Write-Host ""
}

function Check-Prerequisites {
  Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
  $tools = @("docker", "kubectl", "minikube")
  foreach ($tool in $tools) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
      Write-Host "  ❌ '$tool' not found. Please install it first." -ForegroundColor Red
      exit 1
    }
    Write-Host "  ✅ $tool found" -ForegroundColor Green
  }
}

function Start-Minikube {
  Write-Host "`n🏃 Starting Minikube cluster..." -ForegroundColor Yellow
  $status = minikube status --format='{{.Host}}' 2>$null
  if ($status -ne "Running") {
    minikube start --driver=docker --cpus=2 --memory=2048 --disk-size=10g
    Write-Host "  ✅ Minikube started" -ForegroundColor Green
  } else {
    Write-Host "  ✅ Minikube already running" -ForegroundColor Green
  }

  # Enable ingress addon
  Write-Host "`n🔌 Enabling Ingress addon..." -ForegroundColor Yellow
  minikube addons enable ingress
  minikube addons enable ingress-dns
  minikube addons enable metrics-server
  Write-Host "  ✅ Addons enabled (ingress, ingress-dns, metrics-server)" -ForegroundColor Green
}

function Build-DockerImage {
  Write-Host "`n🐳 Building Docker image..." -ForegroundColor Yellow
  # Point Docker to Minikube's daemon (so image is available in cluster)
  & minikube -p minikube docker-env --shell powershell | Invoke-Expression
  docker build -t $IMAGE .
  Write-Host "  ✅ Image built: $IMAGE" -ForegroundColor Green
}

function Apply-Namespace {
  Write-Host "`n📦 Creating namespace..." -ForegroundColor Yellow
  kubectl apply -f "$K8S_DIR\namespace.yaml"
  Write-Host "  ✅ Namespace '$NAMESPACE' ready" -ForegroundColor Green
}

function Create-TLSSecret {
  Write-Host "`n🔐 Creating TLS secret..." -ForegroundColor Yellow
  # Delete existing secret (if any) then recreate
  kubectl delete secret portfolio-tls-secret -n $NAMESPACE --ignore-not-found
  kubectl create secret tls portfolio-tls-secret `
    --cert="$CERT" `
    --key="$KEY" `
    --namespace=$NAMESPACE
  Write-Host "  ✅ TLS secret created from: $CERT" -ForegroundColor Green
}

function Deploy-Manifests {
  Write-Host "`n🚢 Applying Kubernetes manifests..." -ForegroundColor Yellow
  kubectl apply -f "$K8S_DIR\deployment.yaml"
  Write-Host "  ✅ Deployment, Service, Ingress, HPA applied" -ForegroundColor Green
}

function Wait-ForPods {
  Write-Host "`n⏳ Waiting for pods to be ready..." -ForegroundColor Yellow
  kubectl rollout status deployment/portfolio-deployment -n $NAMESPACE --timeout=120s
  Write-Host "  ✅ All pods are running!" -ForegroundColor Green
}

function Show-Status {
  Write-Host "`n📊 Cluster Status:" -ForegroundColor Cyan
  Write-Host "`n── Pods ──────────────────────────────────────────────" -ForegroundColor DarkGray
  kubectl get pods -n $NAMESPACE -o wide
  Write-Host "`n── Services ──────────────────────────────────────────" -ForegroundColor DarkGray
  kubectl get services -n $NAMESPACE
  Write-Host "`n── Ingress ───────────────────────────────────────────" -ForegroundColor DarkGray
  kubectl get ingress -n $NAMESPACE
  Write-Host "`n── HPA ───────────────────────────────────────────────" -ForegroundColor DarkGray
  kubectl get hpa -n $NAMESPACE
}

function Open-Site {
  Write-Host "`n🌐 Opening https://$DOMAIN ..." -ForegroundColor Yellow
  $ip = minikube ip
  Write-Host "  📍 Minikube IP: $ip" -ForegroundColor Cyan
  Write-Host "  🔗 URL: https://$DOMAIN" -ForegroundColor Cyan
  Start-Process "https://$DOMAIN"
}

function Teardown {
  Write-Host "`n🗑️  Tearing down portfolio deployment..." -ForegroundColor Red
  kubectl delete namespace $NAMESPACE --ignore-not-found
  Write-Host "  ✅ Namespace '$NAMESPACE' deleted" -ForegroundColor Green
}

# ── MAIN ─────────────────────────────────────────────────
Write-Banner

if ($Status) {
  Show-Status
  exit 0
}

if ($Logs) {
  kubectl logs -n $NAMESPACE -l app=portfolio --all-containers --follow
  exit 0
}

if ($Clean) {
  Teardown
  Write-Host "`n✅ Clean teardown complete." -ForegroundColor Green
  exit 0
}

# Full deploy sequence
Check-Prerequisites
Start-Minikube
Build-DockerImage
Apply-Namespace
Create-TLSSecret
Deploy-Manifests
Wait-ForPods
Show-Status
Open-Site

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅  DEPLOYMENT COMPLETE!                           ║" -ForegroundColor Green
Write-Host "║   🌐  https://surendhiran.dev.com                    ║" -ForegroundColor Green
Write-Host "║   🐳  Docker image : portfolio:latest                ║" -ForegroundColor Green
Write-Host "║   ☸️   Namespace    : portfolio                       ║" -ForegroundColor Green
Write-Host "║   📦  Replicas     : 3 (HPA: 2–8 auto)              ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor DarkGray
Write-Host "  .\run-k8s.ps1 -Status   → check pod/service status" -ForegroundColor DarkGray
Write-Host "  .\run-k8s.ps1 -Logs     → tail live pod logs" -ForegroundColor DarkGray
Write-Host "  .\run-k8s.ps1 -Clean    → tear down everything" -ForegroundColor DarkGray
