import NextImage from 'next/image';

import { Box, Flex, Text, VStack } from '@repo/ui/chakra-ui';

import { EpisodeItem } from '../types/episodes';

type EpisodeCardProps = {
  episode: EpisodeItem;
  imageWidth: string;
  onClick: () => void;
};

export default function EpisodeCard({
  episode,
  imageWidth,
  onClick,
}: EpisodeCardProps) {
  return (
    <Box
      position="relative"
      cursor="pointer"
      transition="transform 0.2s"
      _hover={{
        transform: 'scale(1.02)',
      }}
      onClick={onClick}
    >
      <NextImage
        style={{ width: imageWidth, height: 'auto' }}
        src={episode.thumbnailPost.imageUrl}
        alt={episode.title}
        width={800}
        height={0}
        priority
      />

      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="gray.600/50"
        transition="background-color 0.2s"
        _hover={{
          bg: 'blue.600/40',
        }}
      >
        <Flex justify="center" align="center" h="full">
          <VStack>
            <Text
              color="white"
              fontSize="md"
              fontWeight="bold"
              textDecoration="underline"
              textDecorationThickness="2px"
              textUnderlineOffset="3px"
            >
              {episode.title}
            </Text>
            <Text
              color="white"
              fontSize="sm"
              fontWeight="bold"
            >
              {`(全${episode.totalPosts}話)`}
            </Text>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}
