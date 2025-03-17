// ナビゲーション状態復元用のストア
// https://zustand.docs.pmnd.rs/hooks/use-store-with-equality-fn

import { createStore } from 'zustand';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional';

export type NavigationStoreKey = 'home' | 'episodes';

export type NavigationState = {
  currentPagePath: string | null;
  scrollPosition: number;
};

export type NavigationActions = {
  setCurrentPagePath: (currentPagePath: string | null) => void;
  setScrollPosition: (scrollPosition: number) => void;
};

export type NavigationStore = NavigationState & NavigationActions;

const initialState: NavigationState = {
  currentPagePath: null,
  scrollPosition: 0,
};

const createNavigationStore = () => {
  return createStore<NavigationStore>()((set) => ({
    ...initialState,
    setCurrentPagePath: (currentPagePath) => set({ currentPagePath }),
    setScrollPosition: (scrollPosition) => set({ scrollPosition }),
  }));
};

const defaultNavigationStores = new Map<
  NavigationStoreKey,
  ReturnType<typeof createNavigationStore>
>();

// 画面ごとのストアを生成するファクトリ関数
const createNavigationStoreFactory = (
  navigationStores: typeof defaultNavigationStores,
) => {
  return (navigationStoreKey: NavigationStoreKey) => {
    if (!navigationStores.has(navigationStoreKey)) {
      navigationStores.set(navigationStoreKey, createNavigationStore());
    }
    return navigationStores.get(navigationStoreKey)!;
  };
};

const getOrCreateNavigationStoreByKey = createNavigationStoreFactory(defaultNavigationStores);

/**
 * 画面ごとのストアを取得するフック
 * @param storeKey ストアキー
 * @param selector ストアの状態を選択する関数
 */
export const useNavigationStore = <U>(
  storeKey: NavigationStoreKey,
  selector: (state: NavigationStore) => U,
) => {
  const store = getOrCreateNavigationStoreByKey(storeKey);
  return useStoreWithEqualityFn(store, selector, shallow);
};
