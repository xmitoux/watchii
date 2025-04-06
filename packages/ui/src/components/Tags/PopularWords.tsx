import { Box, Card, Flex, SimpleGrid, Text } from '@repo/ui/chakra-ui';
import { CharacterIcon } from '@repo/ui/components';

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
              <WordBubble key={word.id} word={word} speakerName={speakerData.speaker.name} to={to(word.id)} />
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
  speakerName: string;
  to: string;
};

/** 語録吹き出しコンポーネント */
function WordBubble({ word, speakerName, to }: WordBubbleProps) {
  // キャラクターごとに色を変える
  // TODO: 簡易的な実装 DBにキャラクターごとの色を持たせる
  const getBubbleColor = (name: string) => {
    const colors = {
      ちいかわ: { bg: 'pink.100', _darkBg: 'pink.800' },
      ハチワレ: { bg: 'hachiBlue.light', _darkBg: 'hachiBlue.dark' },
      うさぎ: { bg: 'usaYellow', _darkBg: 'usaYellow.dark' },
      default: { bg: 'gray.100', _darkBg: 'gray.700' },
    };

    return colors[name as keyof typeof colors] || colors.default;
  };

  const bubbleColor = getBubbleColor(speakerName);

  // プリフェッチ用のリンク
  const prefetchLink = to;

  // TODO: Linkを使用するときに削除する
  function handleLinkClick() {
    if (typeof window !== 'undefined') {
      window.location.href = prefetchLink;
    }
  }

  return (
    <Box position="relative" cursor="pointer" onClick={handleLinkClick}>
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
