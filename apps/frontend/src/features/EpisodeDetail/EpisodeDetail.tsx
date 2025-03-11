import { useState } from 'react';

import { Button } from '@repo/ui/chakra-ui/button';
import { MdTune } from '@repo/ui/icons';

import { DisplayMode, DisplaySettingsDrawer, SortOrder } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';

import { PostGallery } from '../PostGallery/PostGallery';

import { EpisodeDetailProps } from './types';

export default function EpisodeDetail({ episodeTitle, posts }: EpisodeDetailProps) {
  // 並び順のstate
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
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
  };

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
        posts={posts}
        displayMode={displayMode}
      />
    </Layout>
  );
}
