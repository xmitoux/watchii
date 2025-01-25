import NextImage from 'next/image';
import { useState } from 'react';
import useSWR from 'swr';

import { Flex, Heading, Tabs, useBreakpointValue } from '@repo/ui/chakra-ui';
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

type PostsFindResponse = {
  id: number;
  imageUrl: string;
}[];

const fetcher = (url: string) => fetch(url).then(res => res.json());

/** 表示形式 */
const DisplayMode = {
  ONE_COLUMN: 'one-column',
  TWO_COLUMN: 'two-column',
} as const;

type DisplayMode = typeof DisplayMode[keyof typeof DisplayMode];

export default function Home() {
  const { data: posts, error, isLoading } = useSWR<PostsFindResponse>('/api/posts', fetcher);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [open, setOpen] = useState(false);

  // 現在の表示設定
  const [currentDisplaySetting, setCurrentDisplaySetting] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);
  // ドロワー内の適用前の表示設定
  const [tempDisplaySetting, setTempDisplaySetting] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);

  const imageWidth = isMobile
    ? (currentDisplaySetting === 'one-column' ? '80vw' : '40vw')
    : '300px';

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
      setTempDisplaySetting(currentDisplaySetting);
    }

    // ドロワー開閉状態を更新
    setOpen(open);
  }

  // 表示設定適用処理
  function handleApplySettings() {
    if (isMobile) {
      // 現在の表示設定を更新
      setCurrentDisplaySetting(tempDisplaySetting);
    }

    setOpen(false);
  }

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
            {isMobile && (
              <>
                <Heading size="sm" marginBottom={2}>画像の表示形式</Heading>

                {/* 表示形式タブ */}
                <Flex justify="center">
                  <Tabs.Root
                    value={tempDisplaySetting}
                    defaultValue="大きく表示"
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
                </Flex>
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
        {posts?.map(post => (
          <NextImage
            key={post.id}
            style={{ width: imageWidth, height: 'auto' }}
            src={post.imageUrl}
            alt={`post id: ${post.id.toString()}`}
            width={600}
            height={0}
            priority
            onClick={() => handleImageClick(post.imageUrl)}
          />
        ))}
      </Flex>

      {/* 拡大表示ダイアログ */}
      <DialogRoot
        open={isImageDialogOpen}
        placement="center"
        onOpenChange={e => setIsImageDialogOpen(e.open)}
      >
        <DialogContent background="transparent" boxShadow="none">
          <DialogBody>
            <NextImage
              style={{ width: '500px', height: 'auto' }}
              src={selectedImage}
              alt="拡大画像"
              width={1000}
              height={0}
              priority
              onClick={() => setIsImageDialogOpen(false)}
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Layout>
  );
}
