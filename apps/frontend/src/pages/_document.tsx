import { Head, Html, Main, NextScript } from 'next/document';

import { kosugi_maru } from '@repo/ui/utils';

export default function Document() {
  return (
    <Html className={kosugi_maru.className} lang="ja" suppressHydrationWarning>
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
