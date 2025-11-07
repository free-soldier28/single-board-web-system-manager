export function getApiBase() {
  const envHost = import.meta.env.VITE_API_BASE;
  const envPort = import.meta.env.VITE_API_PORT;
  const baseUrl = 'api'

  if (envHost && envHost.trim() !== '') {
    const port = envPort && envPort.trim() !== '' ? envPort : '3001';
    return `${envHost}:${port}/${baseUrl}`;
  }

  const hostname = window.location.hostname;
  const port = envPort && envPort.trim() !== '' ? envPort : '3001';
  return `http://${hostname}:${port}/${baseUrl}`;
}
