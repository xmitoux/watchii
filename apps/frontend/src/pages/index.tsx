import NextImage from 'next/image';
import { useState } from 'react';

import { Center, Flex } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { DialogBody, DialogContent, DialogRoot } from '@repo/ui/chakra-ui/dialog';
import { MdTune } from '@repo/ui/icons';

import { DisplayMode, DisplaySettingsDrawer, SortOrder } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

type PostFindAllResponse = {
  posts: {
    id: number;
    imageUrl: string;
    postedAt: Date;
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

  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();

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
