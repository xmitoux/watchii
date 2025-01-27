import { useCallback, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

import { Center, Flex, useBreakpointValue } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { MdTune } from '@repo/ui/icons';

import { DisplayMode, DisplaySettingsDrawer, SortOrder } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';

import EpisodeCard from './components/EpisodeCard';
import { EpisodeItem } from './types/episodes';

type EpisodeFindAllResponse = {
  episodes: EpisodeItem[];
  total: number;
};

// 1ページあたりの表示件数
const LIMIT = 12;

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Episodes() {
  // 並び順のstate
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  const { data, error, size, setSize, isLoading } = useSWRInfinite<EpisodeFindAllResponse>(getKey, fetcher);

  // 各ページ(無限スクロールで取得する画像単位)のURLを生成する関数
  function getKey(pageIndex: number, previousPageData: EpisodeFindAllResponse | null) {
    // 前のページが無い、かつtotalよりも多く取得している場合はnullを返して終了
    if (previousPageData && previousPageData.episodes.length < LIMIT) { return null; }

    // 最初のページ以降は、offset を計算して URL に含める
    const offset = pageIndex * LIMIT;
    const url = `/api/episodes?limit=${LIMIT}&offset=${offset}&sort=${sortOrder}`;
    return url;
  }

  // Intersectionを監視するコールバック
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLoading) {
      setSize(prev => prev + 1);
    }
  }, [isLoading, setSize]);

  // 監視対象の要素をセットするref
  const observerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) { return; }

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '100px', // 少し早めに発火させる
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [handleObserver]);

  // 全投稿を結合
  const allEpisodes = data
    ? [...new Map(
      data.flatMap(page => page.episodes).map(episode => [episode.id, episode]),
    ).values()]
    : [];
  const isReachingEnd = data && data[data.length - 1]?.episodes.length < LIMIT;
  const isLoadingMore = isLoading || (size > 0 && data && data[size - 1] === undefined && !isReachingEnd);
  const total = data?.[0]?.total ?? 0;

  /** モバイルデバイス(スマホ・タブレット)か */
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const [drawerOpen, setDrawerOpen] = useState(false);
  // 現在の表示設定
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);

  const imageWidth = isMobile
    ? (displayMode === 'one-column' ? '90vw' : '40vw')
    : '500px';

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  function handleImageClick(episodeId: number) {
    console.log('TODO: エピソード詳細に遷移する', episodeId);
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
        {allEpisodes?.map(episode => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            imageWidth={imageWidth}
            onClick={() => handleImageClick(episode.id)}
          />
        ))}
      </Flex>

      {/* ローディング状態の表示 */}
      {isLoadingMore && (
        <Center p={4}>読み込み中...🔄</Center>
      )}

      {/* 無限スクロール用の監視対象要素 */}
      {allEpisodes.length < total && (
        <div ref={observerRef} style={{ height: '10px' }} />
      )}
    </Layout>
  );
}
