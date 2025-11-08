const express = require('express');
const getLocalIp = require('../utils/get-local-ip');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ ok: true, serverIp: getLocalIp() });
});

module.exports = router;
