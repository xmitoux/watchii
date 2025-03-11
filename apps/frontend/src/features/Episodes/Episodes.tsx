import { useRouter } from 'next/router';
import { useState } from 'react';

import { Center, Flex, HStack } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@repo/ui/chakra-ui/pagination';
import { EpisodeCard } from '@repo/ui/components';
import { useDeviceType } from '@repo/ui/hooks';
import { MdTune } from '@repo/ui/icons';

import { DisplayMode, DisplaySettingsDrawer, SortOrder } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';

import { EpisodesProps } from './types';

export default function Episodes({ episodes, total, currentPage, perPage }: EpisodesProps) {
  // 並び順のstate
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();

  const [drawerOpen, setDrawerOpen] = useState(false);
  // 現在の表示設定
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);

  const imageWidth = isMobile
    ? (displayMode === 'one-column' ? '90vw' : '40vw')
    : '300px';

  const router = useRouter();

  function handleImageClick(episodeId: number) {
    router.push(`/episodes/ep/${episodeId}`);
  }

  /** 表示設定適用処理 */
  const handleApplySettings = ({ sortOrder, displayMode }: { sortOrder: SortOrder; displayMode: DisplayMode }) => {
    if (isMobile) {
      // 表示形式を更新
      setDisplayMode(displayMode);
    }

    // 表示順を更新
    handleSortChange(sortOrder);
  };

  // 並び順変更時の処理
  const handleSortChange = (newSort: SortOrder) => {
    setSortOrder(newSort);
  };

  return (
    <Layout
      title="エピソード一覧"
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

      {/* エピソード一覧 */}
      <Flex
        flexWrap="wrap"
        gap={4}
        justify="center"
      >
        {episodes?.map(episode => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            imageWidth={imageWidth}
            onClick={() => handleImageClick(episode.id)}
          />
        ))}
      </Flex>

      {/* ページネーション */}
      <Center mt={4}>
        <PaginationRoot
          variant="solid"
          count={total}
          pageSize={perPage}
          defaultPage={currentPage}
          siblingCount={isMobile ? 0 : 2}
          getHref={page => `/episodes/page/${page}`}
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
