import { Head, Html, Main, NextScript } from 'next/document';

import { kosugi_maru } from '@repo/ui/utils';

export default function Document() {
  const appName = 'Watchii';
  const appUrl = 'https://watchii.vercel.app';
  const appDescription = 'ちいかわが読めるアプリです🐰🐱🐭';
  const ogImageUrl = 'https://watchii.vercel.app/images/og-image.png';

  return (
    <Html className={kosugi_maru.className} lang="ja" suppressHydrationWarning>
      <Head>
        {/* 基本のメタタグ */}
        <meta name="description" content={appDescription} />

        {/* OGP基本設定 */}
        <meta property="og:site_name" content={appName} />
        <meta property="og:url" content={appUrl} />
        <meta property="og:title" content={`${appName} - ちいかわ漫画ビューア`} />
        <meta property="og:description" content={appDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />

        <link crossOrigin="use-credentials" href="/manifest.json" rel="manifest" />
        <link href="/apple-touch-icon-180x180.png" rel="apple-touch-icon"></link>
        <meta name="theme-color" content="#9DD7F2" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
