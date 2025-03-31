import Link from 'next/link';

import { Box, Flex, Text, VStack } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';

import { EpisodeItem } from '../../types/episodes';
import { hachi_maru_pop } from '../../utils/fonts';

type EpisodeCardProps = {
  episode: EpisodeItem;
  imageWidth: string;
  href: string;
};

export function EpisodeCard({
  episode,
  imageWidth,
  href,
}: EpisodeCardProps) {
  return (
    <Link href={href} prefetch={true}>
      <Box
        position="relative"
        cursor="pointer"
        transition="transform 0.2s"
        _hover={{
          transform: 'scale(1.02)',
        }}
      >
        <NextImage
          src={episode.thumbnailPost.filename}
          alt={episode.title}
          width={400}
          styleWidth={imageWidth}
          priority
        />

        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="usaYellow/40"
          borderRadius={10}
          transition="background-color 0.2s"
          _hover={{
            bg: 'hachiBlue/40',
          }}
        >
          <Flex justify="center" align="center" h="full">
            <VStack>
              <Text
                className={hachi_maru_pop.className}
                color="blackPrimary"
                fontSize="lg"
                fontWeight="600"
                textDecoration="underline"
                textDecorationThickness="2px"
                textUnderlineOffset="3px"
              >
                {episode.title}
              </Text>
              <Text
                className={hachi_maru_pop.className}
                color="blackPrimary"
                fontSize="md"
                fontWeight="600"
              >
                {`(全${episode.totalPosts}話)`}
              </Text>
            </VStack>
          </Flex>
        </Box>
      </Box>
    </Link>
  );
}
