import Link from 'next/link';

import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
} from '@repo/ui/chakra-ui';
import { IoLogoGithub } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';

/** このアプリについてコンポーネント */
export default function AboutThisApp() {
  const currentYear = new Date().getFullYear();

  return (
    <Layout title="このアプリについて" canBack noFooter noMenu>
      <Container maxW="md">
        <VStack align="start" gap={8}>
          <AbourSection title="アプリの目的">
            <Text>
              Watchii(以下、本アプリ)は、ナガノ氏の人気作品「ちいかわ」用のビューアアプリです。
              <br />
              個人的な学習のために作成されたもので、一般公開や商用利用を目的としていません。
            </Text>
          </AbourSection>

          <AbourSection title="著作権について">
            <Text>
              「ちいかわ」およびその関連キャラクター、コンテンツの著作権はナガノ氏および権利者に帰属します。
              <br />
              本アプリは著作権の侵害を意図するものではなく、著作権法で認められる私的利用および学習目的の範囲内での使用を想定しています。
            </Text>
          </AbourSection>

          <AbourSection title="免責事項">
            <Box pl={4}>
              <List.Root>
                <ListItem>本アプリの商用利用や第三者への配布は行いません。</ListItem>
                <ListItem>本アプリに含まれる画像やコンテンツの無断転載・複製・再配布は禁止します。</ListItem>
                <ListItem>本アプリの使用によって生じるいかなる問題や損害についても、作成者は責任を負いません。</ListItem>
                <ListItem>権利者からの要請があった場合は、速やかに使用を中止します。</ListItem>
              </List.Root>
            </Box>
          </AbourSection>

          <AbourSection title="コンタクト">
            <Text mb={4}>
              権利者からのお問い合わせや要請がある場合は、下記までご連絡ください。
            </Text>
            <Link href="https://github.com/xmitoux/watchii" target="_blank">
              <Center>
                <Button bg="hachiBlue">
                  <IoLogoGithub />
                  GitHub
                </Button>
              </Center>
            </Link>
          </AbourSection>
        </VStack>

        <Text fontSize="sm" color={{ base: 'gray.500', _dark: 'gray.400' }} textAlign="center" mt={10}>
          © Watchii
          {' '}
          {currentYear}
        </Text>
      </Container>
    </Layout>
  );
}

type AbourSectionProps = {
  title: string;
  children: React.ReactNode;
};

function AbourSection({ title, children }: AbourSectionProps) {
  return (
    <Box>
      <Heading size="lg" mb={2}>{title}</Heading>
      {children}
    </Box>
  );
}
