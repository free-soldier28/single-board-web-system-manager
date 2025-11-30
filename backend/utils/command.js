const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function runCommand(command) {
    console.log(`Executing: ${command}`);
    try {
        const { stdout, stderr } = await exec(command, { timeout: 5000 });
        if (stderr) {
            console.error(`Stderr for "${command}": ${stderr}`);
        }
        return stdout;
    } catch (error) {
        console.error(`Error executing "${command}":`, error.message, error.stderr);
        throw new Error(`Command "${command}" failed: ${error.message} ${error.stderr || ''}`);
    }
}

module.exports = { runCommand };