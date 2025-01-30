import NextImage from 'next/image';
import { useEffect, useState } from 'react';

import { Box, Center, Flex, HStack, Icon } from '@repo/ui/chakra-ui';
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
import { PostEntity } from '@repo/ui/types';

type PostFindAllResponse = {
  posts: PostEntity[];
  total: number;
};

type SelectedPost = PostEntity;

type EpisodePostSelectDialogProps = {
  isOpen: boolean;
  onOpenChange: (e: { open: boolean }) => void;
  initialSelectedPosts?: SelectedPost[];
  episodeId?: number;
  onSelect: (selectedPosts: SelectedPost[]) => void;
};

export const EpisodePostSelectDialog = ({
  isOpen,
  onOpenChange,
  initialSelectedPosts = [],
  episodeId,
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
    queryString: episodeId ? `episodeId=${episodeId}` : '',
  });

  // 全投稿を結合
  const allPosts = data ? data.flatMap(page => page.posts) : [];

  // 選択状態を管理するstate
  const [selectedPosts, setSelectedPosts] = useState<SelectedPost[]>([]);

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
      const filtered = isSelected ? prev.filter(p => p.id !== post.id) : [...prev, post];
      // 選択したあとは上から投稿順に表示したいので昇順ソートする
      return filtered.sort((a, b) => a.postedAt.localeCompare(b.postedAt));
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
                  transition="transform 0.2s"
                  _hover={{
                    transform: 'scale(1.02)',
                  }}
                  onClick={() => togglePostSelection(post)}
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
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg={isSelected ? 'cyan.500/30' : ''}
                    _hover={isSelected ? {} : { bg: 'blue.600/40' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {isSelected && (
                      <Icon fontSize="4xl" color="green.600" bg="white" borderRadius="full">
                        <MdCheckCircle />
                      </Icon>
                    )}
                  </Box>
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
