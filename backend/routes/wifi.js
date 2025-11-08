const express = require('express');
const { runCommand } = require('../utils/command');
const { splitEscaped } = require('../utils/helpers');

const router = express.Router();

router.get('/scan', async (req, res) => {
  try {
    const output = await runCommand(
      `nmcli -t -f SSID,BSSID,SIGNAL,SECURITY,ACTIVE device wifi list`
    );

    const networks = output
      .split('\n')
      .map(line => {
        if (!line.trim()) return null;

        const [ssid, bssid, signal, security, active] = splitEscaped(line);
        if (!ssid || !bssid || isNaN(parseInt(signal))) return null;

        return {
          ssid,
          bssid,
          signal: parseInt(signal),
          security,
          requiresPassword: security && security.trim() !== '--',
          isActive: active === 'yes'
        };
      })
      .filter(Boolean);

    res.json({ networks });
  } catch (e) {
    console.error('Scan error:', e);
    res.status(500).json({
      message: 'Failed to scan networks.',
      error: e.details || e.message
    });
  }
});

router.post('/connect', express.json(), async (req, res) => {
  const { ssid, password, iface = 'wlan0' } = req.body;
  if (!ssid) return res.status(400).json({ message: 'SSID required.' });

  try {
    let cmd;

    if (password && password.trim()) {
      cmd = `nmcli dev wifi connect "${ssid}" ifname "${iface}" password "${password}"`;
    } else {
      cmd = `nmcli dev wifi connect "${ssid}" ifname "${iface}"`;
    }

    const output = await runCommand(cmd);

    const stateRaw = await runCommand(`nmcli -t -f GENERAL.STATE device show ${iface}`);
    const stateCode = parseInt(stateRaw.split(':')[1]);
    const stateMap = {
      10: 'disconnected',
      20: 'connecting',
      30: 'connected (local only)',
      40: 'connected (site only)',
      50: 'connected (global)'
    };
    const connectionState = stateMap[stateCode] || `unknown (${stateCode})`;

    res.json({
      message: 'Connection attempt finished.',
      details: output,
      state: connectionState
    });

  } catch (e) {
    res.status(500).json({
      message: 'Connection failed.',
      error: e.details || e.message
    });
  }
});

router.post('/disconnect', express.json(), async (req, res) => {
  const { iface = 'wlan0' } = req.body;
  try {
    const out = await runCommand(`nmcli device disconnect ${iface}`);
    res.json({ message: 'Device disconnected.', details: out });
  } catch (e) {
    res.status(500).json({ message: 'Disconnect failed.', error: e.details || e.message });
  }
});

router.get('/status', async (req, res) => {
  const iface = req.query.iface || 'wlan0';
  try {
    // returns GENERAL.CONNECTION:SSID (or --)
    const connRaw = await runCommand(`nmcli -t -f GENERAL.CONNECTION device show ${iface}`);
    const connectedSSID = (connRaw.split(':')[1] || '').trim() || null;
    
    // also grab IP if needed
    const ipRaw = await runCommand(`nmcli -t -f IP4.ADDRESS device show ${iface}`);
    const ip = ipRaw.split(':')[1] ? ipRaw.split(':')[1].trim() : null;
    res.json({ connectedSSID, ip });
  } catch (e) {
    res.status(500).json({ message: 'Status failed.', error: e.details || e.message });
  }
});

module.exports = router;
