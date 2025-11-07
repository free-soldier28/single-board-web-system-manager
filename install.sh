#!/bin/bash
set -e

echo "================================================="
echo "⚙️ single-board-web-manager: Minimal Install Script"
echo "================================================="

# --- 1. Check and install Node.js and build tools ---
echo "1. Checking Node.js and build tools..."
if command -v node &>/dev/null && command -v npm &>/dev/null; then
    echo "   ✅ Node.js and npm already installed."
else
    echo "   ⬇️ Installing Node.js and npm..."
    curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Always install build tools (safe to repeat)
sudo apt install -y build-essential python3

NODE_PATH=$(which node)
NMBIN=$(which nmcli)
INSTALL_USER=$(whoami)
SUDOERS_FILE="/etc/sudoers.d/single-board-web-manager-nmcli"

echo "   ✅ Node.js path: $NODE_PATH"
echo "   ✅ nmcli path: $NMBIN"

# --- 2. Configure sudo for nmcli (NOPASSWD) ---
echo "2. Configuring sudo for nmcli (NOPASSWD)..."
if [ -f "$SUDOERS_FILE" ]; then
    echo "   ℹ️ Sudoers file already exists: $SUDOERS_FILE"
else
    echo "$INSTALL_USER ALL=(root) NOPASSWD: $NMBIN" | sudo tee "$SUDOERS_FILE" > /dev/null
    sudo chmod 0440 "$SUDOERS_FILE"
    echo "   ✅ '$INSTALL_USER' can run 'sudo nmcli' without password."
fi

# --- 3. Run setup-or-restart-services.sh ---
echo "3. Running setup-or-restart-services.sh..."
SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
bash "$SCRIPT_DIR/setup-or-restart-services.sh"

echo "================================================="
echo "🎉 Setup complete. Services configured and running."
echo "================================================="
