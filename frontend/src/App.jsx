import { useWifiManager } from './hooks/useWifiManager';
import WifiManager from './components/WifiManager';

const App = () => {
  const {
    networks,
    loading,
    connectInfo,
    setConnectInfo,
    message,
    activeConnection,
    fetchNetworks,
    handleConnect,
    handleDisconnect,
    selectNetwork,
    refreshingStatus,
    fetchStatus,
  } = useWifiManager();

  return (
    <WifiManager
      networks={networks}
      loading={loading}
      connectInfo={connectInfo}
      setConnectInfo={setConnectInfo}
      message={message}
      activeConnection={activeConnection}
      fetchNetworks={fetchNetworks}
      handleConnect={handleConnect}
      handleDisconnect={handleDisconnect}
      selectNetwork={selectNetwork}
      refreshingStatus={refreshingStatus}
      fetchStatus={fetchStatus}
    />
  );
};

export default App;
