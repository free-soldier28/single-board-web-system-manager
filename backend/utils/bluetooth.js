function parseDevices(str) {
    return str
      .split('\n')
      .map(line => {
        const match = line.match(/Device\s+([A-Fa-f0-9:]+)\s+(.+)$/i);
        if (!match) return null;

        return {
          mac: match[1].toUpperCase(),
          name: match[2].trim()
        };
      })
      .filter(Boolean);
}

module.exports = { parseDevices };