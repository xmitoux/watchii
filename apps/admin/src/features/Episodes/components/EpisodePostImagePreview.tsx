import { MdCheckCircle, MdClose } from 'react-icons/md';

import { Box, Flex, Icon, IconButton } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';
import { useDeviceType } from '@repo/ui/hooks';
import { PostEntity } from '@repo/ui/types';

interface EpisodeImagePreviewProps {
  posts: PostEntity[];
  thumbnailPostId: number | null;
  onThumbnailSelect: (postId: number) => void;
  onPostRemove: (postId: number, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function EpisodeImagePreview({
  posts,
  thumbnailPostId,
  onThumbnailSelect,
  onPostRemove,
}: EpisodeImagePreviewProps) {
  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '40vw' : '200px';

  if (posts.length === 0) { return null; }

  return (
    <Box height="50vh" p={{ base: 0, lg: 2 }} overflow="auto">
      <Flex justify={{ base: 'space-evenly', lg: 'start' }} gap={4} wrap="wrap">
        {posts.map((post) => {
          const isSelected = post.id === thumbnailPostId;

          return (
            <Box
              key={post.id}
              position="relative"
              cursor="pointer"
              transition="transform 0.2s"
              _hover={{
                transform: 'scale(1.02)',
              }}
              onClick={() => onThumbnailSelect(post.id)}
            >
              <NextImage
                src={post.filename}
                width={310}
                styleWidth={imageWidth}
                alt="選択された画像"
                priority
              />

              {/* サムネイル選択状態のオーバーレイ */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg={isSelected ? 'cyan.500/30' : ''}
                _hover={!isSelected ? { bg: 'blue.600/40' } : {}}
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

              {/* 削除ボタン */}
              <IconButton
                rounded="full"
                colorPalette="red"
                size="2xs"
                position="absolute"
                top={1}
                right={1}
                transition="transform 0.2s"
                _hover={{
                  transform: 'scale(1.2)',
                }}
                onClick={e => onPostRemove(post.id, e)}
              >
                <MdClose />
              </IconButton>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}
