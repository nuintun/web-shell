import os from 'os';
import http from 'http';
import https from 'http';
import WebSocket from 'ws';
import { spawn } from 'node-pty';
import { deserializer, XTermActions, XTermInputMessage, XTermResizeMessage } from '../utils/xterm';

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

export default function useXTerm(server: http.Server | https.Server) {
  const ws = new WebSocket.Server({ server, path: '/socket/xterm' });

  ws.on('connection', function connection(ws) {
    const xterm = spawn(shell, [], {
      name: 'xterm',
      cwd: process.env.HOME,
      env: process.env as Record<string, string>
    });

    xterm.onData(data => {
      ws.send(data);
    });

    xterm.onExit(() => {
      ws.close();
    });

    ws.on('message', message => {
      let data: XTermInputMessage | XTermResizeMessage;

      try {
        data = deserializer(message as string);
      } catch {
        return xterm.kill();
      }

      switch (data.action) {
        case XTermActions.stdin:
          xterm.write(data.payload);
          break;
        case XTermActions.resize:
          xterm.resize(data.payload.cols, data.payload.rows);
          break;
        default:
          xterm.kill();
      }
    });

    ws.on('close', () => {
      xterm.kill();
    });
  });
}
