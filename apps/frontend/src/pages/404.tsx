import NextImage from 'next/image';
import Link from 'next/link';

import { Button, Flex, Image, Text, VStack } from '@repo/ui/chakra-ui';
import { MdHome } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';

export default function Custom404() {
  return (
    <Layout title="404" canBack>
      <Flex direction="column" justify="center" align="center" minH="80vh">
        <VStack maxW="600px" textAlign="center">
          <Text
            color="blackSwitch"
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="bold"
          >
            ページが見つかりません！
          </Text>

          <Image asChild alt="">
            <NextImage
              src="/images/404.webp"
              width={1000}
              height={0}
              style={{ width: '500px', height: 'auto' }}
              priority
              alt="404 Not Found"
            />
          </Image>

          <Link href="/home/page/1">
            <Button
              size="lg"
              color="chiiWhite"
              bg={{ base: 'hachiBlue', _dark: 'hachiBlue.dark' }}
              rounded="full"
              px={6}
              _hover={{ transform: 'scale(1.05)' }}
              transition="all 0.2s"
            >
              <MdHome />
              ホームに戻る
            </Button>
          </Link>
        </VStack>
      </Flex>
    </Layout>
  );
}
