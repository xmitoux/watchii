import NextImage from 'next/image';
import { useCallback, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

import { Center, Flex, useBreakpointValue } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { DialogBody, DialogContent, DialogRoot } from '@repo/ui/chakra-ui/dialog';
import { MdTune } from '@repo/ui/icons';

import { DisplayMode, DisplaySettingsDrawer, SortOrder } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';

type PostFindAllResponse = {
  posts: {
    id: number;
    imageUrl: string;
    postedAt: Date;
  }[];
  total: number;
};

// 1ページあたりの表示件数
const LIMIT = 12;

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  // 並び順のstate
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  const { data, error, size, setSize, isLoading } = useSWRInfinite<PostFindAllResponse>(getKey, fetcher);

  // 各ページ(無限スクロールで取得する画像単位)のURLを生成する関数
  function getKey(pageIndex: number, previousPageData: PostFindAllResponse | null) {
    // 前のページが無い、かつtotalよりも多く取得している場合はnullを返して終了
    if (previousPageData && previousPageData.posts.length < LIMIT) { return null; }

    // 最初のページ以降は、offset を計算して URL に含める
    const offset = pageIndex * LIMIT;
    const url = `/api/posts?limit=${LIMIT}&offset=${offset}&sort=${sortOrder}`;
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
  const allPosts = data ? data.flatMap(page => page.posts) : [];
  const isReachingEnd = data && data[data.length - 1]?.posts.length < LIMIT;
  const isLoadingMore = isLoading || (size > 0 && data && data[size - 1] === undefined && !isReachingEnd);
  const total = data?.[0]?.total ?? 0;

  /** モバイルデバイス(スマホ・タブレット)か */
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
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

  function handleImageClick(imageUrl: string) {
    setSelectedImage(imageUrl);
    setIsImageDialogOpen(true);
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
      <Flex
        flexWrap="wrap"
        gap={4}
        justify="center"
      >
        {allPosts?.map(post => (
          <NextImage
            key={post.id}
            style={{ width: imageWidth, height: 'auto' }}
            src={post.imageUrl}
            alt={`post id: ${post.id.toString()}`}
            width={800}
            height={0}
            priority
            onClick={() => handleImageClick(post.imageUrl)}
          />
        ))}
      </Flex>

      {/* ローディング状態の表示 */}
      {isLoadingMore && (
        <Center p={4}>読み込み中...🔄</Center>
      )}

      {/* 無限スクロール用の監視対象要素 */}
      {allPosts.length < total && (
        <div ref={observerRef} style={{ height: '10px' }} />
      )}

      {/* 拡大表示ダイアログ */}
      <DialogRoot
        open={isImageDialogOpen}
        placement="center"
        size="xl"
        onOpenChange={e => setIsImageDialogOpen(e.open)}
      >
        <DialogContent background="transparent" boxShadow="none" onClick={() => setIsImageDialogOpen(false)}>
          <DialogBody>
            <Center>
              <NextImage
                style={{
                  // スマホとタブレットの場合は画面幅いっぱいに拡大
                  width: isMobile ? '90vw' : 'auto',
                  // PCの場合は画像を画面高さいっぱいに拡大
                  height: isMobile ? 'auto' : '80vh',
                }}
                src={selectedImage}
                alt="拡大画像"
                width={800}
                height={0}
              />
            </Center>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Layout>
  );
}
