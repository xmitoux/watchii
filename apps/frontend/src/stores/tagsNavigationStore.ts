// タグ一覧画面用ナビゲーションストア

import { create } from 'zustand';

export type TagsNavigationState = {
  shouldBackToTags: boolean;
};

export type TagsNavigationActions = {
  setShouldBackToTags: (should: boolean) => void;
};

export type TagsNavigationStore = TagsNavigationState & TagsNavigationActions;

const initialState: TagsNavigationState = {
  shouldBackToTags: true,
};

export const useTagsNavigationStore = create<TagsNavigationStore>()((set) => ({
  ...initialState,
  setShouldBackToTags: (should) => set({ shouldBackToTags: should }),
}));
