import { useRouter } from 'next/router';
import { useState } from 'react';

import { Button } from '@repo/ui/chakra-ui/button';
import { useInfiniteScroll } from '@repo/ui/hooks';
import { MdTune } from '@repo/ui/icons';
import { SimplePost } from '@repo/ui/types';

import { DisplayMode, DisplaySettingsDrawer, SortOrder } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';

import { PostGallery } from '../PostGallery/PostGallery';

type EpisodeFindOneResponse = {
  episodeTitle: string;
  posts: SimplePost[];
  total: number;
};

export default function EpisodeDetail() {
  const router = useRouter();
  const { id } = router.query;

  // 並び順のstate
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

  const {
    data,
    error,
    isLoading,
    isLoadingMore,
    setSize,
    observerRef,
    total,
  } = useInfiniteScroll<EpisodeFindOneResponse>({
    baseUrl: `/api/episodes/${id}`,
    sortOrder,
  });

  const allPosts = data ? data.flatMap(page => page.posts) : [];
  const episodeTitle = data ? data.flatMap(page => page.episodeTitle)[0] : '';

  const [drawerOpen, setDrawerOpen] = useState(false);

  // 現在の表示設定
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);

  /** 表示設定適用処理 */
  const handleApplySettings = ({ sortOrder, displayMode }: { sortOrder: SortOrder; displayMode: DisplayMode }) => {
    // 表示形式を更新
    setDisplayMode(displayMode);
    // 表示順を更新
    handleSortChange(sortOrder);
  };

  // 並び順変更時の処理
  const handleSortChange = (newSort: SortOrder) => {
    setSortOrder(newSort);
    // データをリセットして最初から取得し直す
    setSize(1);
  };

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <Layout
      title={episodeTitle}
      canBack
      actionButton={(
        <Button variant="plain" onClick={() => setDrawerOpen(true)}>
          <MdTune />
        </Button>
      )}
    >
      {/* 表示設定ドロワー */}
      <DisplaySettingsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        sortOrder={sortOrder}
        displayMode={displayMode}
        onApplySettings={handleApplySettings}
      />

      {/* post一覧 */}
      <PostGallery
        posts={allPosts}
        displayMode={displayMode}
        isLoadingMore={isLoadingMore}
        observerRef={observerRef}
        hasMore={allPosts.length < total}
      />
    </Layout>
  );
}
