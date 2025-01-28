import NextImage from 'next/image';

import { Center, Flex, HStack } from '@repo/ui/chakra-ui';
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

type PostFindAllResponse = {
  posts: {
    id: number;
    imageUrl: string;
  }[];
  total: number;
};

type ImageViewerDialogProps = {
  isOpen: boolean;
  onOpenChange: (e: { open: boolean }) => void;
};

export const EpisodePostSelectDialog = ({
  isOpen,
  onOpenChange,
}: ImageViewerDialogProps) => {
  const {
    data,
    error,
    isLoading,
    isLoadingMore,
    observerRef,
    total,
  } = useInfiniteScroll<PostFindAllResponse>({
    baseUrl: '/api/posts/find-episode-target',
  });

  // 全投稿を結合
  const allPosts = data ? data.flatMap(page => page.posts) : [];

  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '40vw' : '300px';

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
            <Button onClick={() => onOpenChange({ open: false })}>確定</Button>
          </HStack>
        </DialogHeader>

        <DialogBody>
          <Flex justify="center" gap={4} flexWrap="wrap">
            {allPosts.map(post => (
              <NextImage
                key={post.id}
                style={{ width: imageWidth, height: 'auto' }}
                src={post.imageUrl}
                width={800}
                height={0}
                alt={post.imageUrl}
                priority
                onClick={() => console.log(post.id)}
              />
            ))}
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
