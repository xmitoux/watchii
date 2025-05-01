import NextImage from 'next/image';

import { Flex, Image, Text, VStack } from '@repo/ui/chakra-ui';

/** お気に入り0件コンポーネント */
export default function NoFavs() {
  return (
    <Flex direction="column" justify="center" align="center" minH="80vh">
      <VStack maxW="600px" textAlign="center">
        <TextComponent text="お気に入りがないよ！" />
        <TextComponent text="漫画詳細から追加してみよう！" />

        <Image asChild alt="">
          <NextImage
            src="/images/no-favs.webp"
            width={1000}
            height={0}
            style={{ width: '500px', height: 'auto' }}
            priority
            alt="お気に入り0件"
          />
        </Image>
      </VStack>
    </Flex>
  );
}

function TextComponent({ text }: { text: string }) {
  return (
    <Text color="blackSwitch" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
      {text}
    </Text>
  );
}
