const { exec } = require('child_process');

const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(`sudo ${cmd}`, (error, stdout, stderr) => {
      if (error) {
        return reject({ error: stderr || error.message, details: error.message });
      }
      resolve(stdout.trim());
    });
  });
};

module.exports = { runCommand };
