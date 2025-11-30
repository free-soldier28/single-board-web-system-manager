import { useBluetoothManager } from '../hooks/useBluetoothManager';
import { IoBluetoothSharp } from 'react-icons/io5';

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
    <div className="flex flex-col">
      <div className="p-4 sm:p-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={fetchDevices}
            disabled={loading}
            className={`px-4 py-2 rounded font-semibold whitespace-nowrap ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Scanning...' : 'Rescan Devices'}
          </button>

          {message && <div className="p-3 rounded bg-green-100 text-green-800">{message}</div>}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto space-y-2 px-4 sm:px-8 pb-8">
        {devices.map((dev, i) => (
          <li key={i} className="p-3 border rounded-lg bg-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <IoBluetoothSharp className="w-6 h-6 text-black" />
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
                  className="w-24 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => connect(dev.mac)}
                  className="w-24 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Connect
                </button>
              )}

              {dev.paired ? (
                <button
                  onClick={() => unpair(dev.mac)}
                  className="w-24 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Unpair
                </button>
              ) : (
                <button
                  onClick={() => pair(dev.mac)}
                  className="w-24 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
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
