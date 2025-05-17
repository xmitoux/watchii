import Link from 'next/link';

import {
  Box,
  Center,
  Container,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
} from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { IoLogoGithub } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';

/** 利用規約コンポーネント */
export default function TermsOfUse() {
  const currentYear = new Date().getFullYear();

  return (
    <Layout title="利用規約" canBack noFooter noMenu>
      <Container maxW="md">
        <VStack align="start" gap={8}>
          <TermsSection title="1. はじめに">
            <Text>
              この利用規約（以下「本規約」）は、Watchii（以下「本アプリ」）の利用条件を定めるものです。
              <br />
              ユーザーは本アプリを利用することにより、本規約に同意したものとみなされます。
            </Text>
          </TermsSection>

          <TermsSection title="2. アプリの目的">
            <Text>
              本アプリは、ナガノ氏の作品「ちいかわ」用のビューアアプリです。
              <br />
              個人的な学習のために作成されたもので、一般公開や商用利用を目的としていません。
            </Text>
          </TermsSection>

          <TermsSection title="3. 利用登録">
            <Text>
              本アプリの利用にはユーザー登録が必要です。ユーザーは以下のいずれかの方法で登録できます。
            </Text>
            <Box pl={4} mt={2}>
              <List.Root>
                <ListItem>メールアドレスとパスワードによる登録</ListItem>
                <ListItem>OAuth認証(GitHub/Google)</ListItem>
              </List.Root>
            </Box>
          </TermsSection>

          <TermsSection title="4. 禁止事項">
            <Text>ユーザーは本アプリの利用にあたり、以下の行為を行ってはなりません。</Text>
            <Box pl={4} mt={2}>
              <List.Root>
                <ListItem>本アプリの商用利用や第三者への配布</ListItem>
                <ListItem>本アプリに含まれる画像やコンテンツの無断転載・複製・再配布</ListItem>
                <ListItem>不正アクセスやシステムに負荷をかける行為</ListItem>
                <ListItem>その他、法令や公序良俗に反する行為</ListItem>
              </List.Root>
            </Box>
          </TermsSection>

          <TermsSection title="5. 退会">
            <Text>
              ユーザーはいつでも本アプリから退会することができます。
              <br />
              退会した場合、ユーザーの登録情報は全て削除されます。
            </Text>
          </TermsSection>

          <TermsSection title="6. 著作権について">
            <Text>
              「ちいかわ」およびその関連キャラクター、コンテンツの著作権はナガノ氏および権利者に帰属します。
              <br />
              本アプリは著作権の侵害を意図するものではなく、著作権法で認められる私的利用および学習目的の範囲内での使用を想定しています。
            </Text>
          </TermsSection>

          <TermsSection title="7. 免責事項">
            <Text>ユーザーは本アプリを利用するにあたり、以下の点に同意するものとします。</Text>
            <Box pl={4} mt={2}>
              <List.Root>
                <ListItem>本アプリの商用利用や第三者への配布は行いません。</ListItem>
                <ListItem>本アプリに含まれる画像やコンテンツの無断転載・複製・再配布は禁止します。</ListItem>
                <ListItem>本アプリの使用によって生じるいかなる問題や損害についても、作成者は責任を負いません。</ListItem>
                <ListItem>権利者からの要請があった場合は、速やかに使用を中止します。</ListItem>
              </List.Root>
            </Box>
          </TermsSection>

          <TermsSection title="8. 規約の変更">
            <Text>
              本規約は予告なく変更される場合があります。変更後の規約は本アプリ上に掲載された時点で効力を生じるものとします。
            </Text>
          </TermsSection>

          <TermsSection title="9. お問い合わせ">
            <Text mb={4}>
              権利者からのお問い合わせや要請がある場合は、下記までご連絡ください。
            </Text>

            <Center>
              <BasicButton color="white" bg="black" asChild>
                <Link href="https://github.com/xmitoux/watchii" target="_blank">
                  <IoLogoGithub />
                  GitHub
                </Link>
              </BasicButton>
            </Center>
          </TermsSection>
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

type TermsSectionProps = {
  title: string;
  children: React.ReactNode;
};

function TermsSection({ title, children }: TermsSectionProps) {
  return (
    <Box>
      <Heading size="lg" mb={2}>{title}</Heading>
      {children}
    </Box>
  );
}
