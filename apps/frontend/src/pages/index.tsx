import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PWAInstallGuide from '@/features/PWAInstallGuide/PWAInstallGuide';

/** PWA判定 */
function isPWA() {
  // 通常のPWA判定
  if (window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches) {
    return true;
  }

  // iOS Safari判定
  const nav = window.navigator as { standalone?: boolean };
  if (nav.standalone) {
    return true;
  }

  return false;
}

export default function Index() {
  const router = useRouter();

  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (isPWA()) {
      // PWAならガイド表示しない
      router.push('/home/page/1');
      return;
    }

    // ガイド見たフラグ(ガイドコンポーネントで設定)を判定
    const hasSeenGuide = localStorage.getItem('hasSeenPWAGuide');
    if (hasSeenGuide) {
      // ガイドを見たことあるならスキップ
      router.push('/home/page/1');
    }
    else {
      setShowGuide(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return showGuide && <PWAInstallGuide />;
}
