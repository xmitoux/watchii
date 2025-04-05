import NextImage from 'next/image';

import { Box, Card, Flex, Image, SimpleGrid, Text } from '@repo/ui/chakra-ui';
import { useNextImage } from '@repo/ui/hooks';

type PopularWordProps = {
  popularWordSpeakers: Array<{
    speaker: {
      id: number;
      name: string;
      iconFilename: string;
    };
    words: Array<{
      id: number;
      word: string;
      kana: string;
    }>;
  }>;
};

/** 語録コンポーネント */
export function PopularWords({ popularWordSpeakers }: PopularWordProps) {
  return (
    <Box w="full">
      {popularWordSpeakers?.map((speakerData) => (
        <Card.Root
          key={speakerData.speaker.id}
          bg="whiteSwitch"
          mb={4}
          p={4}
        >
          {/* キャラクター情報 */}
          <Flex align="center">
            {/* キャラクターアイコン */}
            <CharacterIcon character={speakerData.speaker} />

            {/* キャラクター名 */}
            <Text
              fontWeight="bold"
              fontSize="lg"
              ml={3}
              color="blackSwitch"
            >
              {speakerData.speaker.name}
            </Text>
          </Flex>

          {/* 語録一覧 */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} pt={4}>
            {speakerData.words.map((word) => (
              <WordBubble key={word.id} word={word} speakerName={speakerData.speaker.name} />
            ))}
          </SimpleGrid>
        </Card.Root>
      ))}
    </Box>
  );
}

type CharacterIconProps = {
  character: {
    id: number;
    name: string;
    iconFilename: string;
  };
};

/** キャラクターアイコンコンポーネント */
function CharacterIcon({ character }: CharacterIconProps) {
  const src = `chara-icons/${character.iconFilename}`;
  const width = 120;
  const { imageLoader, imageSrc } = useNextImage({ src, width });

  return (
    <Box
      bg="hachiBlue"
      borderRadius="full"
      p={1}
      transition="all 0.2s"
      _hover={{
        transform: 'scale(1.05)',
      }}
    >
      <Image asChild borderRadius="full" objectFit="cover" alt="">
        <NextImage
          src={imageSrc}
          loader={imageLoader}
          width={width}
          height={0}
          style={{ width: '50px', height: 'auto' }}
          alt={character.name}
        />
      </Image>
    </Box>
  );
}

type WordBubbleProps = {
  word: {
    id: number;
    word: string;
    kana: string;
  };
  speakerName: string;
};

/** 語録吹き出しコンポーネント */
function WordBubble({ word, speakerName }: WordBubbleProps) {
  // キャラクターごとに色を変える（簡易的な実装）
  const getBubbleColor = (name: string) => {
    const colors = {
      ちいかわ: { bg: 'pink.100', _darkBg: 'pink.800' },
      ハチワレ: { bg: 'hachiBlue.light', _darkBg: 'hachiBlue.dark' },
      うさぎ: { bg: 'usaYellow', _darkBg: 'usaYellow.dark' },
      // デフォルト
      default: { bg: 'gray.100', _darkBg: 'gray.700' },
    };

    return colors[name as keyof typeof colors] || colors.default;
  };

  const bubbleColor = getBubbleColor(speakerName);

  return (
    <Box position="relative">
      {/* 吹き出しの本体 */}
      <Box
        bg={{ base: bubbleColor.bg, _dark: bubbleColor._darkBg }}
        borderRadius="lg"
        mb={1}
        p={3}
        transition="transform 0.15s, box-shadow 0.15s"
        _hover={{
          transform: 'translateY(-2px)',
        }}
      >
        <Text fontWeight="medium" fontSize="md">
          {word.word}
        </Text>
      </Box>

      {/* シンプルな丸みを帯びた三角形 - CSSのみ */}
      <Box
        position="absolute"
        top="-8px"
        left="20px"
        width="16px"
        height="16px"
        bg={{ base: bubbleColor.bg, _dark: bubbleColor._darkBg }}
        borderRadius={3}
        transform="rotate(45deg)"
        zIndex={1}
      />
    </Box>
  );
}
