# 🌐 single-board-web-manager

## 📖 Project Overview

**single-board-web-manager** is a **web interface** designed to remotely manage core configurations and services on a **Single-Board Computer (SBC)**, such as the Orange Pi.

The initial focus is providing a web interface to **sytem manage ** on the SBC. This allows users to control system settings without direct terminal access.

The project uses a **Node.js/Express backend** running on the SBC to execute system commands and a **React frontend** for the user interface.

### 🟢 Frontend and Backend Ports

- The **frontend (React)** runs on **port 3000** during development, providing the UI with hot-reloading.
- The **backend (Node.js/Express)** runs on **port 3001**.

Communication between frontend and backend is enabled via **CORS** (`Access-Control-Allow-Origin`), allowing the React app to request data from the Express server running on a different port.

**Technologies used for this separation:**
- **React** for building the frontend UI with state management and hooks.
- **Tailwind CSS** for styling the UI quickly and responsively.
- **Node.js + Express** to provide backend API endpoints that interact with system commands.
- **CORS headers** in Express to allow cross-origin requests from the React frontend.
- **`nmcli`** (NetworkManager CLI) on Linux for scanning and managing Wi-Fi connections.

---

## ⚙️ Installation and Setup

### 1. Prerequisites

Before starting, ensure your SBC is running a modern Linux distribution (like Armbian or Debian) and has the following installed:

* **`curl`** (for downloading Node.js setup script)
* **`sudo`**
* **`NetworkManager`** (`nmcli`)

### 2. Installing Node.js and Dependencies

This step installs the necessary runtime environment (Node.js) and the required packages (`express`) for the backend API.

The following commands are automated by the `install.sh` script:

```bash
# 1. Download and install Node.js (LTS version)
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Install Node.js dependencies (e.g., Express)
npm install

# 3. Run backend
npm start

# 4. Run frontend
npm run dev
