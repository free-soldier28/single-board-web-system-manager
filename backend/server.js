const express = require('express');
const CorsManager = require("./utils/cors-manager");
const getLocalIp = require("./utils/get-local-ip");

const PORT = process.env.PORT || 3001;
const BASE_URL = '/api';

const app = express();
const corsManager = new CorsManager();

// apply cors middleware
app.use(corsManager.middleware());

app.use(`${BASE_URL}/test`, require('./routes/test'));
app.use(`${BASE_URL}/wifi`, require('./routes/wifi'));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://${getLocalIp()}:${PORT}`);
});
