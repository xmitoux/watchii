/** PWAインストールガイド表示用のカスタムフック */
export const usePWAInstallGuide = () => {
  /** PWA判定 */
  function isPWA() {
    if (typeof window !== 'undefined') {
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
    }

    return false;
  }

  return {
    isPWA,
  };
};
