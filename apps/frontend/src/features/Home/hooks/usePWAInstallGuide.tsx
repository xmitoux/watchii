import { useState } from 'react';

import { Icon, IconButton } from '@repo/ui/chakra-ui';
import { MdLightbulb } from '@repo/ui/icons';

import PWAInstallGuideComponent from '@/features/PWAInstallGuide/PWAInstallGuide';

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

  const [showPWAGuide, setShowPWAGuide] = useState(false);

  const togglePWAGuide = () => {
    setShowPWAGuide((prev) => !prev);
  };

  function PWSGuideButton() {
    return (
      <IconButton
        size="md"
        rounded="full"
        bg="transparent"
        color="white"
        onClick={togglePWAGuide}
      >
        <Icon>
          <MdLightbulb />
        </Icon>
      </IconButton>
    );
  }

  function PWAInstallGuide() {
    return <PWAInstallGuideComponent onClose={togglePWAGuide} />;
  }

  return {
    isPWA,
    showPWAGuide,
    PWSGuideButton,
    PWAInstallGuide,
  };
};
