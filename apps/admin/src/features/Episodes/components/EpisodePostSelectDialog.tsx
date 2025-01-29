import NextImage from 'next/image';
import { useEffect, useState } from 'react';

import { Box, Center, Flex, HStack, Icon, Show } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@repo/ui/chakra-ui/dialog';
import { useDeviceType } from '@repo/ui/hooks';
import { useInfiniteScroll } from '@repo/ui/hooks';
import { MdCheckCircle } from '@repo/ui/icons';
import { SimplePost } from '@repo/ui/types';

type PostFindAllResponse = {
  posts: SimplePost[];
  total: number;
};

type SelectedPost = SimplePost;

type EpisodePostSelectDialogProps = {
  isOpen: boolean;
  onOpenChange: (e: { open: boolean }) => void;
  initialSelectedPosts?: SelectedPost[];
  onSelect: (selectedPosts: SelectedPost[]) => void;
};

export const EpisodePostSelectDialog = ({
  isOpen,
  onOpenChange,
  initialSelectedPosts = [],
  onSelect,
}: EpisodePostSelectDialogProps) => {
  const {
    data,
    error,
    isLoading,
    isLoadingMore,
    observerRef,
    total,
  } = useInfiniteScroll<PostFindAllResponse>({
    baseUrl: '/api/posts/episode-targets',
  });

  // 全投稿を結合
  const allPosts = data ? data.flatMap(page => page.posts) : [];

  // 選択状態を管理するstate
  const [selectedPosts, setSelectedPosts] = useState<SelectedPost[]>(initialSelectedPosts);

  // ダイアログが開かれるたびに初期選択状態を反映
  useEffect(() => {
    if (isOpen) {
      setSelectedPosts(initialSelectedPosts);
    }
  }, [isOpen, initialSelectedPosts]);

  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '40vw' : '300px';

  // 画像選択の切り替え処理
  const togglePostSelection = (post: SelectedPost) => {
    setSelectedPosts((prev) => {
      const isSelected = prev.some(p => p.id === post.id);
      return isSelected ? prev.filter(p => p.id !== post.id) : [...prev, post];
    });
  };

  // 確定ボタンクリック時の処理
  const handleConfirm = () => {
    onSelect(selectedPosts);
    onOpenChange({ open: false });
  };

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <DialogRoot open={isOpen} placement="center" size="full" scrollBehavior="inside" onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <HStack>
            <DialogTitle>エピソードPostを選択する</DialogTitle>
            <Button onClick={handleConfirm}>確定</Button>
          </HStack>
        </DialogHeader>

        <DialogBody>
          <Flex justify="center" gap={4} flexWrap="wrap">
            {allPosts.map((post) => {
              const isSelected = selectedPosts.some(p => p.id === post.id);
              return (
                <Box
                  key={post.id}
                  position="relative"
                  cursor="pointer"
                  onClick={() => togglePostSelection({ id: post.id, imageUrl: post.imageUrl })}
                >
                  <NextImage
                    style={{ width: imageWidth, height: 'auto' }}
                    src={post.imageUrl}
                    width={600}
                    height={0}
                    alt={post.imageUrl}
                    priority
                  />

                  {/* 選択状態のオーバーレイ */}
                  <Show when={isSelected}>
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="blue.500/30"
                      display="flex"
                      alignItems="start"
                      justifyContent="end"
                    >
                      <Icon fontSize="4xl" color="green.600">
                        <MdCheckCircle />
                      </Icon>
                    </Box>
                  </Show>
                </Box>
              );
            })}
          </Flex>

          {/* 無限スクロールローディング */}
          {isLoadingMore && <Center p={4}>読み込み中...🔄</Center>}

          {/* 無限スクロール監視対象要素 */}
          {allPosts.length < total && <div ref={observerRef} style={{ height: '10px' }} />}
        </DialogBody>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
