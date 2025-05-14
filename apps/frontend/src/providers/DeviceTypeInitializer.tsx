import React from 'react';

import { useDeviceTypeStore } from '@/stores/deviceTypeStore';

// ブレイクポイント設定
const BREAKPOINTS = {
  md: 768,
  lg: 992,
} as const;

const updateDeviceTypeInfo = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const width = window.innerWidth;

  const isMobile = width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isDesktop = width >= BREAKPOINTS.lg;
  const isPWA = detectPWA();

  useDeviceTypeStore.setState({
    isMobile,
    isTablet,
    isDesktop,
    isPWA,
    deviceType: isDesktop ? 'desktop' : (isTablet ? 'tablet' : 'mobile'),
  });
};

// UA判定（オプション）
const detectDeviceTypeFromUA = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return;
  }

  const ua = navigator.userAgent.toLowerCase();

  // iPadの特殊判定
  const isIPad = /ipad/.test(ua)
    || (/macintosh/.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1);

  // タブレット判定
  const isTablet = isIPad
    || (/android/.test(ua) && !/mobile/.test(ua))
    || (/tablet/.test(ua));

  // モバイル判定
  const isMobile = /iphone|ipod|android.*mobile|windows.*phone|blackberry/.test(ua) && !isTablet;

  // デスクトップ判定
  const isDesktop = !isMobile && !isTablet;

  const isPWA = detectPWA();

  useDeviceTypeStore.setState({
    isMobile,
    isTablet,
    isDesktop,
    isPWA,
    deviceType: isDesktop ? 'desktop' : (isTablet ? 'tablet' : 'mobile'),
  });
};

const detectPWA = () => {
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
};

/**
 * デバイスタイプ初期化コンポーネント
 * _app.tsxやLayoutコンポーネントでこれを使う
 */
export function DeviceTypeInitializer({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    // 初期化（UAベース）
    detectDeviceTypeFromUA();
    // 初期化（サイズベース）
    updateDeviceTypeInfo();

    // リサイズリスナー
    const handleResize = () => {
      updateDeviceTypeInfo();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
}
