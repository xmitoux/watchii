import Link from 'next/link';

import { Box, Flex, Text } from '@repo/ui/chakra-ui';
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
          width={700}
          styleWidth={imageWidth}
          priority
        />

        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="usagiYellow/10"
          borderRadius={10}
          transition="background-color 0.2s"
          _hover={{
            bg: 'hachiBlue/20',
          }}
        >
          {/* ぼかしコンテナを配置する半透明のオーバーレイ */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="90%"
            py={3}
            backdropFilter="blur(0.8px)"
            style={{
              WebkitBackdropFilter: 'blur(0.8px)',
            }}
            bg="hachiBlue/40"
            borderRadius="md"
            border="1px solid"
            borderColor="hachiBlue/20"
          >
            <Flex direction="column" justify="center" align="center" h="full">
              {/* エピソードタイトル */}
              <Text
                className={hachi_maru_pop.className}
                color="chiiWhite"
                fontSize="md"
                fontWeight="600"
                textShadow="0px 1px 2px rgba(0, 0, 0, 0.9)"
                textAlign="center"
                px={2}
              >
                {episode.title}
              </Text>
              {/* エピソードの話数 */}
              <Text
                className={hachi_maru_pop.className}
                color="chiiWhite"
                fontSize="sm"
                fontWeight="600"
                textShadow="0px 1px 2px rgba(0, 0, 0, 0.9)"
              >
                {`(全${episode.totalPosts}話)`}
              </Text>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
