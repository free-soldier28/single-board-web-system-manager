const express = require('express');
const getLocalIp = require('../get-local-ip');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ ok: true, serverIp: getLocalIp() });
});

module.exports = router;
