import NextImage from 'next/image';
import { useCallback, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

import { Center, Flex, Heading, Tabs, useBreakpointValue } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { DialogBody, DialogContent, DialogRoot } from '@repo/ui/chakra-ui/dialog';
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from '@repo/ui/chakra-ui/drawer';
import { MdCropPortrait, MdGridView, MdTune } from '@repo/ui/icons';

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

/** 表示順 */
const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

type SortOrder = typeof SortOrder[keyof typeof SortOrder];

/** 表示形式 */
const DisplayMode = {
  ONE_COLUMN: 'one-column',
  TWO_COLUMN: 'two-column',
} as const;

type DisplayMode = typeof DisplayMode[keyof typeof DisplayMode];

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
  const [open, setOpen] = useState(false);

  // ドロワー内の適用前の表示設定
  const [tempSortOrder, setTempSortOrder] = useState<SortOrder>(SortOrder.DESC);
  // 現在の表示設定
  const [currentDisplaySetting, setCurrentDisplaySetting] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);
  // ドロワー内の適用前の表示設定
  const [tempDisplaySetting, setTempDisplaySetting] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);

  const imageWidth = isMobile
    ? (currentDisplaySetting === 'one-column' ? '80vw' : '40vw')
    : '20vw';

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

  /** ドロワー開閉処理 */
  function handleDrawerOpenClose(open: boolean) {
    if (open) {
      // ドロワーが開いた時に、現在の表示設定を反映
      setTempSortOrder(sortOrder);
      setTempDisplaySetting(currentDisplaySetting);
    }

    // ドロワー開閉状態を更新
    setOpen(open);
  }

  // 表示設定適用処理
  function handleApplySettings() {
    if (isMobile) {
      // 表示形式を更新
      setCurrentDisplaySetting(tempDisplaySetting);
    }

    // 表示順を更新
    handleSortChange(tempSortOrder);

    setOpen(false);
  }

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
        <Button variant="plain" onClick={() => setOpen(true)}>
          <MdTune />
        </Button>
      )}
    >
      {/* 表示設定ドロワー */}
      <DrawerRoot open={open} onOpenChange={e => handleDrawerOpenClose(e.open)}>
        {/* 背景を暗くする */}
        <DrawerBackdrop />

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>表示設定</DrawerTitle>
          </DrawerHeader>

          <DrawerBody>
            <Heading size="sm" marginBottom={2}>画像の表示順</Heading>

            {/* 表示順タブ */}
            <Center>
              <Tabs.Root
                value={tempSortOrder}
                defaultValue={SortOrder.DESC}
                variant="plain"
                onValueChange={({ value }) => setTempSortOrder(value as SortOrder)}
              >
                <Tabs.List bg="bg.muted" rounded="l3" p="1">
                  <Tabs.Trigger value={SortOrder.DESC}>
                    <MdCropPortrait />
                    新着順
                  </Tabs.Trigger>

                  <Tabs.Trigger value={SortOrder.ASC}>
                    <MdGridView />
                    古い順
                  </Tabs.Trigger>
                  <Tabs.Indicator rounded="l2" />
                </Tabs.List>
              </Tabs.Root>
            </Center>

            {isMobile && (
              <>
                <Heading size="sm" marginBottom={2}>画像の表示形式</Heading>

                {/* 表示形式タブ */}
                <Center>
                  <Tabs.Root
                    value={tempDisplaySetting}
                    defaultValue={DisplayMode.ONE_COLUMN}
                    variant="plain"
                    onValueChange={({ value }) => setTempDisplaySetting(value as DisplayMode)}
                  >
                    <Tabs.List bg="bg.muted" rounded="l3" p="1">
                      <Tabs.Trigger value={DisplayMode.ONE_COLUMN}>
                        <MdCropPortrait />
                        1列表示
                      </Tabs.Trigger>

                      <Tabs.Trigger value={DisplayMode.TWO_COLUMN}>
                        <MdGridView />
                        2列表示
                      </Tabs.Trigger>
                      <Tabs.Indicator rounded="l2" />
                    </Tabs.List>
                  </Tabs.Root>
                </Center>
              </>
            )}
          </DrawerBody>

          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant="outline">キャンセル</Button>
            </DrawerActionTrigger>

            <Button onClick={handleApplySettings}>適用</Button>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>

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
