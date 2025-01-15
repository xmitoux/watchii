import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ja" suppressHydrationWarning>
      <Head>
        <link crossOrigin="use-credentials" href="/manifest.json" rel="manifest" />
        <link href="/apple-touch-icon-180x180.png" rel="apple-touch-icon"></link>
        <meta content="#fff" name="theme-color" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
