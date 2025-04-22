import { useEffect } from 'react';

import { useTagsNavigationStore } from '@/stores/tagsNavigationStore';

/** タグ一覧画面の戻るボタン動作制御用カスタムフック */
export const useTagsNavigationToggle = (shouldBackToTags: boolean) => {
  const { setShouldBackToTags } = useTagsNavigationStore();

  useEffect(() => {
    setShouldBackToTags(shouldBackToTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
