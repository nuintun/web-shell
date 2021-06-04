const os = require('os');
const fs = require('fs');
const pty = require('node-pty');

const bash = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const app = pty.spawn(bash, [], {
  name: 'xterm',
  env: process.env,
  cwd: process.env.HOME,
  handleFlowControl: false
});

app.onData(data => {
  process.stdout.write(data);
});

fs.readFile('examples/bash.sh', (error, data) => {
  if (error) app.kill();

  app.write(`${data.toString()}\r`);
});
