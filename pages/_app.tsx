import '/styles/globals.scss';
import 'xterm/css/xterm.css';

import Head from 'next/head';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>xterm</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="xterm" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="application-name" content="xterm" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="apple-mobile-web-app-title" content="xterm" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
