const fs = require("fs");
const path = require("path");
const getLocalIp = require("./get-local-ip");

const CONFIG_FILE = "config.json";

class CorsManager {
  constructor() {
    this.configPath = path.join(__dirname, CONFIG_FILE);
    this.loadConfig();
    this.watchConfig();
  }

  loadConfig() {
    const raw = fs.readFileSync(this.configPath, "utf8");
    const parsed = JSON.parse(raw);

    this.corsConfig = parsed.cors;

    this.allowed = new Set(this.corsConfig.allowedOrigins);

    if (this.corsConfig.autoAddLocalIp) {
      const localIp = getLocalIp();
      const autoUrl = `http://${localIp}:${this.corsConfig.frontendPort}`;
      this.allowed.add(autoUrl);
      console.log("✅ Auto-added local origin:", autoUrl);
    }

    console.log("✅ CORS loaded:", [...this.allowed]);
  }

  watchConfig() {
    if (!this.corsConfig.reloadOnChange) return;

    fs.watch(this.configPath, () => {
      console.log("♻️ Config changed — reloading CORS...");
      try {
        this.loadConfig();
      } catch (e) {
        console.error("❌ Failed to reload CORS config:", e);
      }
    });
  }

  middleware() {
    return (req, res, next) => {
      console.log(`🌐 CORS middleware: ${req.method} ${req.path}`);

      const origin = req.headers.origin;

      if (this.allowed.has(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }

      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === 'OPTIONS') {
        console.log('✅ CORS preflight request handled');
        return res.sendStatus(200);
      }
      next();
    };
  }
}

module.exports = CorsManager;
