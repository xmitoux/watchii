import { useState } from 'react';

import { Center, HStack } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@repo/ui/chakra-ui/pagination';
import { useDeviceType } from '@repo/ui/hooks';
import { MdTune } from '@repo/ui/icons';

import { DisplayMode, DisplaySettingsDrawer } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';
import { PostGallery } from '@/features/PostGallery/PostGallery';

import { HomeProps } from './types/home-types';

export default function Home({ posts, total, currentPage, perPage }: HomeProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);
  const { isMobile } = useDeviceType();

  /** 表示設定適用処理 */
  const handleApplySettings = ({ displayMode }: { displayMode: DisplayMode }) => {
    // 表示形式を更新
    setDisplayMode(displayMode);
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
        displayMode={displayMode}
        onApplySettings={handleApplySettings}
      />

      {/* post一覧 */}
      <PostGallery
        posts={posts}
        displayMode={displayMode}
      />

      {/* ページネーション */}
      <Center mt={4}>
        <PaginationRoot
          variant="solid"
          count={total}
          pageSize={perPage}
          defaultPage={currentPage}
          siblingCount={isMobile ? 0 : 2}
          getHref={page => `/${page}`}
        >
          <HStack px={4}>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Center>
    </Layout>
  );
}
