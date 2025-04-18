import Link from 'next/link';

import { Box, Card, Flex, SimpleGrid, Text } from '@repo/ui/chakra-ui';
import { CharacterIcon } from '@repo/ui/components';

import { getCharacterColor } from '../../utils/character-colors';

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
  to: (id: number) => string;
};

/** 語録コンポーネント */
export function PopularWords({ popularWordSpeakers, to }: PopularWordProps) {
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
            <CharacterIcon character={speakerData.speaker} priority />

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
              <WordBubble key={word.id} word={word} speakerId={speakerData.speaker.id} to={to(word.id)} />
            ))}
          </SimpleGrid>
        </Card.Root>
      ))}
    </Box>
  );
}

type WordBubbleProps = {
  word: {
    id: number;
    word: string;
    kana: string;
  };
  speakerId: number;
  to: string;
};

/** 語録吹き出しコンポーネント */
function WordBubble({ word, speakerId, to }: WordBubbleProps) {
  // キャラクターの名前から色を取得
  const bubbleColorBase = getCharacterColor(speakerId, 'light');
  const bubbleColorDark = getCharacterColor(speakerId, 'dark');

  // プリフェッチ用のリンク
  const prefetchLink = to;

  return (
    <Link href={prefetchLink}>
      <Box position="relative" cursor="pointer">
        {/* 吹き出しの本体 */}
        <Box
          bg={{ base: bubbleColorBase, _dark: bubbleColorDark }}
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
          bg={{ base: bubbleColorBase, _dark: bubbleColorDark }}
          borderRadius={3}
          transform="rotate(45deg)"
          zIndex={1}
        />
      </Box>
    </Link>
  );
}
