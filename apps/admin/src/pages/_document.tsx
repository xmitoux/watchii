import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ja" suppressHydrationWarning>
      <Head>
        <link crossOrigin="use-credentials" href="/manifest.json" rel="manifest" />
        <link href="/apple-touch-icon-180x180.png" rel="apple-touch-icon"></link>
        <meta name="theme-color" content="#F8B5C6" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
