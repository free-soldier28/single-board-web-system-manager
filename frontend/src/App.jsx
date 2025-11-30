import { useState } from 'react';
import { FaWifi } from 'react-icons/fa';
import { IoBluetoothSharp } from 'react-icons/io5';
import WifiManager from './components/WifiManager';
import BluetoothManager from './components/BluetoothManager';

const App = () => {
  const [activeTab, setActiveTab] = useState('bluetooth');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar Tabs */}
      <div className="w-48 bg-white shadow-lg p-4">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('wifi')}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2 ${
              activeTab === 'wifi'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaWifi className="w-5 h-5" /> Wi-Fi
          </button>
          <button
            onClick={() => setActiveTab('bluetooth')}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2 ${
              activeTab === 'bluetooth'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <IoBluetoothSharp className="w-5 h-5" /> Bluetooth
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'wifi' && <WifiManager />}
        {activeTab === 'bluetooth' && <BluetoothManager />}
      </div>
    </div>
  );
};

export default App;
