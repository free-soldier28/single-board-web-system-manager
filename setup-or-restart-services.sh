#!/bin/bash
set -e

# --- Service names ---
BACKEND_SERVICE="sb-web-manager-backend.service"
FRONTEND_SERVICE="sb-web-manager-frontend.service"

# --- Project paths ---
TARGET_DIR="/opt/single-board-web-manager"
BACKEND_DIR="$TARGET_DIR/backend"
FRONTEND_DIR="$TARGET_DIR/frontend"
NODE_PATH=$(which node)
SERVE_PATH=$(which serve)
USER=$(whoami)

echo "==========================================="
echo "🔧 Updating and restarting single-board-web-manager services"
echo "==========================================="

# --- Backend service ---
echo "🔄 Writing backend systemd unit..."
cat <<EOF | sudo tee /etc/systemd/system/$BACKEND_SERVICE > /dev/null
[Unit]
Description=Single Board Web Manager Backend
After=network.target

[Service]
User=$USER
WorkingDirectory=$BACKEND_DIR
ExecStart=$NODE_PATH $BACKEND_DIR/server.js
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# --- Frontend service ---
if [ -f "$FRONTEND_DIR/index.html" ]; then
  echo "🔄 Writing frontend systemd unit..."
  cat <<EOF | sudo tee /etc/systemd/system/$FRONTEND_SERVICE > /dev/null
[Unit]
Description=Single Board Web Manager Frontend
After=network.target

[Service]
User=$USER
WorkingDirectory=$FRONTEND_DIR
ExecStart=$SERVE_PATH -s $FRONTEND_DIR -l 3000
Restart=always

[Install]
WantedBy=multi-user.target
EOF
else
  echo "⚠️ Warning: $FRONTEND_DIR/index.html not found. Skipping frontend service setup."
fi

# --- Reload systemd ---
sudo systemctl daemon-reload

# --- Enable and restart backend ---
sudo systemctl enable "$BACKEND_SERVICE"
sudo systemctl restart "$BACKEND_SERVICE"
sudo systemctl status "$BACKEND_SERVICE" --no-pager

# --- Enable and restart frontend if index.html exists ---
if [ -f "$FRONTEND_DIR/index.html" ]; then
  sudo systemctl enable "$FRONTEND_SERVICE"
  sudo systemctl restart "$FRONTEND_SERVICE"
  sudo systemctl status "$FRONTEND_SERVICE" --no-pager
else
  echo "❌ Frontend service not started — index.html missing."
fi

echo "✅ Backend is active. Frontend status depends on build presence."
