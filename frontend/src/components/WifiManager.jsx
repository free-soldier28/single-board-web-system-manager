import React, { useEffect, useState } from 'react';
import { useWifiManager } from '../hooks/useWifiManager';

const WifiManager = () => {
  const {
    networks,
    loading,
    message,
    activeConnection,
    fetchNetworks,
    handleConnect,
    handleDisconnect,
  } = useWifiManager();

  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchNetworks();
  }, []);

  const handleClick = (net) => {
    if (activeConnection?.ssid === net.ssid) {
      setSelectedNetwork(net);
      setShowModal(false);
    } else if (net.requiresPassword) {
      setSelectedNetwork(net);
      setShowModal(true);
    } else {
      handleConnect({ ssid: net.ssid, password: '' });
    }
  };

  const confirmConnect = () => {
    if (selectedNetwork) {
      handleConnect({ ssid: selectedNetwork.ssid, password });
      setShowModal(false);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-4">🌐 WI-FI Manager</h1>

        <div className="flex items-center mb-4">
          <button
            onClick={fetchNetworks}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
              loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? 'Scanning...' : 'Rescan Networks'}
          </button>

          <div className="ml-auto text-sm text-gray-600">
            Connected: {activeConnection ? <strong>{activeConnection.ssid}</strong> : <em>not connected</em>}
          </div>
        </div>

        {message && <div className="mb-4 p-3 rounded bg-green-100 text-green-800">{message}</div>}

        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {networks.map((net, i) => (
            <li
              key={i}
              onClick={() => handleClick(net)}
              className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center ${
                activeConnection?.ssid === net.ssid ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                  </svg>
                  {net.requiresPassword && (
                    <svg className="absolute w-2.5 h-2.5 text-red-500 -bottom-0.5 -right-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1C6.48 1 2 5.48 2 11v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-9c0-5.52-4.48-10-10-10zm0 2c4.41 0 8 3.59 8 8v1H4v-1c0-4.41 3.59-8 8-8zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <strong>{net.ssid}</strong>
                  <p className="text-xs text-gray-500">{net.security || 'Open'}</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                net.signal > 70 ? 'text-green-600' : net.signal > 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {net.signal}%
              </div>
              {activeConnection?.ssid === net.ssid && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDisconnect();
                  }}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Disconnect
                </button>
              )}
            </li>
          ))}
        </ul>

        {showModal && selectedNetwork && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Connect to {selectedNetwork.ssid}</h2>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmConnect}
                  disabled={!password}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WifiManager;
