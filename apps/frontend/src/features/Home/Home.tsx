import { useState } from 'react';

import { Button } from '@repo/ui/chakra-ui/button';
import { useInfiniteScroll } from '@repo/ui/hooks';
import { MdTune } from '@repo/ui/icons';

import { DisplayMode, DisplaySettingsDrawer, SortOrder } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';
import { PostGallery } from '@/features/PostGallery/PostGallery';

type PostFindAllResponse = {
  posts: {
    id: number;
    filename: string;
  }[];
  total: number;
};

export default function Home() {
  // 並び順のstate
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  const {
    data,
    error,
    isLoading,
    isLoadingMore,
    setSize,
    observerRef,
    total,
  } = useInfiniteScroll<PostFindAllResponse>({
    baseUrl: '/api/posts',
    sortOrder,
  });

  // 全投稿を結合
  const allPosts = data ? data.flatMap(page => page.posts) : [];

  const [drawerOpen, setDrawerOpen] = useState(false);

  // 現在の表示設定
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

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

  return (
    <Layout
      title="Watchii"
      // 表示設定ドロワーを開くボタン
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
