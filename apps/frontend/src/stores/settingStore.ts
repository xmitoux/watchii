// 設定関連ストア

import { create } from 'zustand';

export type SttingState = {
  showPWAGuide: boolean;
};

export type SttingActions = {
  setShowPWAInstallGuide: (showPWAGuide: boolean) => void;
};

export type SttingStore = SttingState & SttingActions;

const initialState: SttingState = {
  showPWAGuide: false,
};

export const useSettingStore = create<SttingStore>()((set) => ({
  ...initialState,
  setShowPWAInstallGuide: (showPWAGuide) => set({ showPWAGuide }),
}));
