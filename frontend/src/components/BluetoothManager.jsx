import { useBluetoothManager } from '../hooks/useBluetoothManager';

const BluetoothManager = () => {
  const {
    devices,
    loading,
    message,
    connectedMac,
    fetchDevices,
    connect,
    disconnect,
    pair,
    unpair,
  } = useBluetoothManager();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🔵 Bluetooth Devices</h2>

      <button
        onClick={fetchDevices}
        disabled={loading}
        className={`mb-4 px-4 py-2 rounded ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? 'Scanning...' : 'Rescan Devices'}
      </button>

      {message && <div className="mb-4 p-3 rounded bg-green-100 text-green-800">{message}</div>}

      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {devices.map((dev, i) => (
          <li key={i} className="p-3 border rounded-lg bg-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V21h1l5.71-5.71-4.3-4.29 4.3-4.29zM7 5.5c.83 0 1.5-.67 1.5-1.5S7.83 2.5 7 2.5 5.5 3.17 5.5 4 6.17 5.5 7 5.5zm5.5 13c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
              </svg>
              <div>
                <strong>{dev.name || 'Unknown Device'}</strong>
                <p className="text-xs text-gray-500">{dev.mac}</p>
                <p className="text-xs text-gray-400">
                  {dev.paired ? 'Paired' : 'Not paired'} | {dev.isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {dev.isConnected ? (
                <button
                  onClick={() => disconnect(dev.mac)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => connect(dev.mac)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Connect
                </button>
              )}

              {dev.paired ? (
                <button
                  onClick={() => unpair(dev.mac)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Unpair
                </button>
              ) : (
                <button
                  onClick={() => pair(dev.mac)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Pair
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BluetoothManager;
