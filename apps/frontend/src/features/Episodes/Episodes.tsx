import { useRouter } from 'next/router';
import { useState } from 'react';

import { Flex } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { EpisodeCard } from '@repo/ui/components';
import { useInfiniteScroll } from '@repo/ui/hooks';
import { useDeviceType } from '@repo/ui/hooks';
import { MdTune } from '@repo/ui/icons';

import { DisplayMode, DisplaySettingsDrawer, SortOrder } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';
import LoadingAnimation from '@/components/Loading/LoadingAnimation';

import type { EpisodeItem } from '@repo/ui/types';

type EpisodeFindAllResponse = {
  episodes: EpisodeItem[];
  total: number;
};

export default function Episodes() {
  // 並び順のstate
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

  const {
    data,
    error,
    isLoading,
    setSize,
    observerRef,
    total,
  } = useInfiniteScroll<EpisodeFindAllResponse>({
    baseUrl: '/api/episodes',
    sortOrder,
  });

  // 全投稿を結合
  const allEpisodes = data ? data.flatMap(page => page.episodes) : [];

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
    router.push(`/episodes/${episodeId}`);
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
    // データをリセットして最初から取得し直す
    setSize(1);
  };

  if (error) {
    return <div>エラーが発生しました</div>;
  }

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
      {isLoading
        ? <LoadingAnimation />
        : (
          <Flex
            flexWrap="wrap"
            gap={4}
            justify="center"
          >
            {allEpisodes?.map(episode => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                imageWidth={imageWidth}
                onClick={() => handleImageClick(episode.id)}
              />
            ))}
          </Flex>
        )}

      {/* 無限スクロール用の監視対象要素 */}
      {allEpisodes.length < total && (
        <div ref={observerRef} style={{ height: '10px' }} />
      )}
    </Layout>
  );
}
