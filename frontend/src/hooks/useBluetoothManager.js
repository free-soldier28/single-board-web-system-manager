import { getApiBase } from "../helpers/api";
import { useEffect, useState } from "react";

const API_URL = `${getApiBase()}/bluetooth`;

export const useBluetoothManager = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [connectedMac, setConnectedMac] = useState("");

  const fetchDevices = async () => {
    setLoading(true);

    try {
      if (devices.length) {
        const res = await fetch(`${API_URL}/scan`);
        const data = await res.json();

        setDevices(data?.devices ?? []);
        setMessage('');
      }

      const [pairedRes, availableRes] = await Promise.all([
        fetch(`${API_URL}/paired`),
        fetch(`${API_URL}/available`),
      ]);

      const paired = await pairedRes?.json();
      const available = await availableRes?.json();

      const mergedDevices = [...available?.devices, ...paired?.devices].reduce(
        (acc, dev) => {
          const existing = acc.find((d) => d.mac === dev.mac);
          if (existing) {
            existing.paired = existing.paired || dev.paired;
          } else {
            acc.push({ ...dev });
          }
          return acc;
        },
        []
      );

      setDevices(mergedDevices);
      setMessage('');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    const checks = await Promise.all(
      devices.map(async (dev) => {
        try {
          const res = await fetch(`${API_URL}/info/${dev.mac}`);
          const data = await res.json();
          return {
            ...dev,
            isConnected: data.isConnected,
            paired: data.isPaired,
          };
        } catch {
          return dev;
        }
      })
    );
    setDevices(checks);
    const active = checks.find((d) => d.isConnected);
    setConnectedMac(active?.mac || "");
  };

  const connect = async (mac) => {
    setMessage(`Connecting to ${mac}...`);
    try {
      const res = await fetch(`${API_URL}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mac }),
      });
      const data = await res.json();
      if (res.ok) {
        setConnectedMac(mac);
        setMessage(data.message);
        refreshStatus();
      } else {
        setMessage(`Failed: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const disconnect = async (mac) => {
    setMessage(`Disconnecting from ${mac}...`);
    try {
      const res = await fetch(`${API_URL}/disconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mac }),
      });
      const data = await res.json();
      if (res.ok) {
        setConnectedMac("");
        setMessage(data.message);
        refreshStatus();
      } else {
        setMessage(`Failed: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const pair = async (mac) => {
    setMessage(`Pairing with ${mac}...`);
    try {
      const res = await fetch(`${API_URL}/pair`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mac }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        refreshStatus();
      } else {
        setMessage(`Failed: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const unpair = async (mac) => {
    setMessage(`Unpairing ${mac}...`);
    try {
      const res = await fetch(`${API_URL}/unpair`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mac }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        refreshStatus();
      } else {
        setMessage(`Failed: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return {
    devices,
    loading,
    message,
    connectedMac,
    fetchDevices,
    refreshStatus,
    connect,
    disconnect,
    pair,
    unpair,
  };
};
