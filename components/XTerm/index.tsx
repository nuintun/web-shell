import { useEffect, useMemo, useRef } from 'react';

import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';
import useWebSocket from '/hooks/useWebSocket';
import { Terminal, ITerminalOptions } from 'xterm';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { serializer, XTermActions } from '/utils/xterm';

export interface XTermProps {
  className?: string;
  options?: ITerminalOptions;
  customKeyEventHandler?(event: KeyboardEvent): boolean;
}

export default function XTerm(props: XTermProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const xterm = useMemo(() => new Terminal(props.options), []);
  const ws = useWebSocket<string>(`ws://${location.host}/socket/xterm`);

  useEffect(() => {
    const fitAddon = new FitAddon();
    const webglAddon = new WebglAddon();
    const resize = () => fitAddon.fit();
    const { customKeyEventHandler } = props;
    const unicode11Addon = new Unicode11Addon();

    if (customKeyEventHandler) {
      xterm.attachCustomKeyEventHandler(customKeyEventHandler);
    }

    xterm.onData(data => {
      ws.send(serializer({ action: XTermActions.stdin, payload: data }));
    });

    xterm.onResize(({ rows, cols }) => {
      ws.send(serializer({ action: XTermActions.resize, payload: { rows, cols } }));
    });

    window.addEventListener('resize', resize, false);

    xterm.open(stageRef.current as HTMLDivElement);

    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webglAddon);
    xterm.loadAddon(unicode11Addon);

    fitAddon.fit();

    xterm.focus();

    return () => {
      ws.disconnect();

      xterm.dispose();

      window.removeEventListener('resize', resize, false);
    };
  }, []);

  useEffect(() => {
    const { data } = ws.message;

    data && xterm.write(data.toString());
  }, [ws.message]);

  return <div className={props.className} ref={stageRef} />;
}
