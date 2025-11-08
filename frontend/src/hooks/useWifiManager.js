import { useState } from 'react';
import { getApiBase } from '../helpers/api';

const API_URL = `${getApiBase()}/wifi`;

export const useWifiManager = () => {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeConnection, setActiveConnection] = useState(null);

  const fetchNetworks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/scan`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Scan failed');

      const uniqueNetworks = Array.from(
        new Map(data.networks.map(n => [n.ssid, n])).values()
      ).filter(n => n.ssid);

      setNetworks(uniqueNetworks);
      setMessage('Scan completed.');

      const statusRes = await fetch(`${API_URL}/status`);
      const statusData = await statusRes.json();
      if (statusRes.ok && statusData.connectedSSID) {
        setActiveConnection({ ssid: statusData.connectedSSID });
      } else {
        setActiveConnection(null);
      }
    } catch (error) {
      console.error('Scan Error:', error);
      setMessage(`Error during scan: ${error.message}`);
      setNetworks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async ({ ssid, password }) => {
    if (!ssid) return;
    setMessage(`Connecting to ${ssid}...`);
    try {
      const response = await fetch(`${API_URL}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssid, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Successfully connected to ${ssid}!`);
        setActiveConnection({ ssid, state: data.state });
      } else {
        setMessage(`Connection failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Connection API Error:', error);
      setMessage(`API Error: ${error.message}`);
    }
  };

  const handleDisconnect = async () => {
    setMessage('Disconnecting...');
    try {
      const response = await fetch(`${API_URL}/disconnect`, { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setMessage('Disconnected.');
        setActiveConnection(null);
      } else {
        setMessage(`Failed to disconnect: ${data.error}`);
      }
    } catch (error) {
      console.error('Disconnect API Error:', error);
      setMessage(`API Error: ${error.message}`);
    }
  };

  return {
    networks,
    loading,
    message,
    activeConnection,
    fetchNetworks,
    handleConnect,
    handleDisconnect,
  };
};
