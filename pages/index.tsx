import styles from '/styles/index.module.scss';

import dynamic from 'next/dynamic';
import { ITerminalOptions } from 'xterm';

const XTerm = dynamic(() => import('/components/XTerm'), { ssr: false });

const xtermOptions: ITerminalOptions = {
  rows: 60,
  cols: 120,
  scrollback: 100,
  cursorBlink: true,
  cursorStyle: 'underline',
  theme: { background: '#000' }
};

export default function Page() {
  return <XTerm className={styles.xterm} options={xtermOptions} />;
}
