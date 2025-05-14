import { create } from 'zustand';

// デバイスタイプ
type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';

// ストアの型定義
interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  isPWA: boolean;
}

// デバイス情報ストア
export const useDeviceTypeStore = create<DeviceState>()(() => ({
  // モバイルファーストでデフォルト値設定
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  deviceType: 'mobile',
  isPWA: false,
}));
