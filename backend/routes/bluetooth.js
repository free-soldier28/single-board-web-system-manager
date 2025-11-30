const express = require('express');
const { runCommand } = require('../utils/command');
const { parseDevices } = require('../utils/bluetooth');

const router = express.Router();

router.get('/scan', async (req, res) => {
  const scanDuration = parseInt(req.query.duration) || 5000;
  const includeStatus = req.query.status === 'true'; // Optional: Get device status
  
  try {
    console.log(`🔍 Starting Bluetooth scan (${scanDuration}ms)...`);

    await runCommand('bluetoothctl scan off')
    .catch(() => console.warn('⚠️ Could not stop previous scan'));

    await runCommand('bluetoothctl scan on')
      .catch(() => console.warn('Could not power on bluetooth, proceeding anyway.'));
    console.log('✅ Scan completed');

    // Get a list of detected devices
    const output = await runCommand('bluetoothctl devices');

    const deviceList = parseDevices(output);
    console.log(`📋 Found ${deviceList.length} devices`);

    // Optional: Get detailed status for each device
    let devices = deviceList;

    if (includeStatus) {
      console.log('🔍 Fetching device status...');
      
      devices = await Promise.all(
        deviceList.map(async (device) => {
          try {
            const info = await runCommand(`bluetoothctl info ${device.mac}`);
            
            return {
              ...device,
              paired: info.includes('Paired: yes'),
              connected: info.includes('Connected: yes'),
              trusted: info.includes('Trusted: yes'),
              blocked: info.includes('Blocked: yes')
            };
          } catch (err) {
            console.warn(`⚠️ Could not get info for ${device.mac}`);
            return {
              ...device,
              paired: false,
              connected: false,
              trusted: false,
              blocked: false
            };
          }
        })
      );

      console.log('✅ Status information retrieved');
    }

    res.json({
      devices,
      scanDuration
    });
  } catch (e) {
    console.error('❌ Bluetooth scan error:', e);

    res.status(500).json({
      success: false,
      message: 'Failed to scan Bluetooth devices.',
      error: e.message
    });
  }
});

router.get('/available', async (req, res) => {
  try {
    console.log('📋 Fetching available Bluetooth devices...');
    
    const output = await runCommand('bluetoothctl devices');
    
    const devices = parseDevices(output);
    console.log(`✅ Found ${devices.length} devices`);

    res.json({
      devices,
      count: devices.length
    });
  } catch (e) {
    console.error('❌ Failed to get device list:', e);
    res.status(500).json({ 
      message: 'Failed to get device list.', 
      error: e.message 
    });
  }
});

router.get('/paired', async (req, res) => {
  try {
    const output = await runCommand('bluetoothctl devices');

    const allDevices = parseDevices(output);

    console.log('Check each device for paired status.');
    const devices = [];

    for (const device of allDevices) {
      try {
        const info = await runCommand(`bluetoothctl info ${device.mac}`);
        const isPaired = info.includes('Paired: yes');
        
        if (isPaired) {
          devices.push({
            name: device.name,
            mac: device.mac,
            paired: true
          });
        }
      } catch (err) {
        console.error(`Error checking device ${device.mac}:`, err);
      }
    }
    res.json({ devices });
  } catch (e) {
    console.error('Bluetooth error:', e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/connect', async (req, res) => {
  const { mac } = req.body;
  if (!mac) return res.status(400).json({ error: 'MAC address required.' });

  try {
    await runCommand(`bluetoothctl connect ${mac}`);
    res.json({ message: `Connected to ${mac}` });
  } catch (e) {
    res.status(500).json({ error: `Failed to connect: ${e.message}` });
  }
});

router.post('/disconnect', async (req, res) => {
  const { mac } = req.body;
  if (!mac) return res.status(400).json({ error: 'MAC address required.' });

  try {
    await runCommand(`bluetoothctl disconnect ${mac}`);
    res.json({ message: `Disconnected from ${mac}` });
  } catch (e) {
    res.status(500).json({ error: `Failed to disconnect: ${e.message}` });
  }
});

router.post('/pair', async (req, res) => {
  const { mac } = req.body;
  if (!mac) return res.status(400).json({ error: 'MAC address required.' });

  try {
    await runCommand(`bluetoothctl pair ${mac}`);
    res.json({ message: `Paired with ${mac}` });
  } catch (e) {
    res.status(500).json({ error: `Failed to pair: ${e.message}` });
  }
});

router.post('/unpair', async (req, res) => {
  const { mac } = req.body;
  if (!mac) return res.status(400).json({ error: 'MAC address required.' });

  try {
    await runCommand(`bluetoothctl remove ${mac}`);
    res.json({ message: `Unpaired ${mac}` });
  } catch (e) {
    res.status(500).json({ error: `Failed to unpair: ${e.message}` });
  }
});

router.get('/info/:mac', async (req, res) => {
  const { mac } = req.params;
  if (!mac) return res.status(400).json({ error: 'MAC address required.' });

  try {
    const output = await runCommand(`bluetoothctl info ${mac}`);
    const isConnected = /Connected:\s+yes/.test(output);
    const isPaired = /Paired:\s+yes/.test(output);
    res.json({ mac, isConnected, isPaired });
  } catch (e) {
    res.status(500).json({ error: `Failed to get info: ${e.message}` });
  }
});

module.exports = router;
