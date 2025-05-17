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

/** プライバシーポリシーコンポーネント */
export default function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <Layout title="プライバシーポリシー" canBack noFooter noMenu>
      <Container maxW="md">
        <VStack align="start" gap={8}>
          <PolicySection title="1. 収集する情報">
            <Text>
              Watchii（以下「本アプリ」）では、以下の情報を収集します。
            </Text>
            <Box pl={4} mt={2}>
              <List.Root>
                <ListItem>メールアドレス</ListItem>
                <ListItem>ユーザー名（GitHub/Googleでログインする場合）</ListItem>
                <ListItem>お気に入り登録した情報</ListItem>
              </List.Root>
            </Box>
          </PolicySection>

          <PolicySection title="2. 情報の利用目的">
            <Text>収集した情報は以下の目的でのみ利用します。</Text>
            <Box pl={4} mt={2}>
              <List.Root>
                <ListItem>ユーザー認証のため</ListItem>
                <ListItem>お気に入り機能の提供のため</ListItem>
                <ListItem>本アプリの機能改善のため</ListItem>
              </List.Root>
            </Box>
          </PolicySection>

          <PolicySection title="3. 第三者への提供">
            <Text>
              収集した情報は、法令に基づく場合を除き、ユーザーの同意なく第三者に提供することはありません。
            </Text>
          </PolicySection>

          <PolicySection title="4. 情報の管理">
            <Text>
              本アプリではユーザー情報の管理に安全な認証システムを使用しています。
              <br />
              管理者はメールアドレスとユーザー名の参照が可能ですが、「2. 情報の利用目的」以外での利用は一切行いません。
            </Text>
          </PolicySection>

          <PolicySection title="5. ユーザーの権利">
            <Text>
              ユーザーはいつでも退会することができ、退会時にはすべてのユーザー情報が削除されます。
            </Text>
          </PolicySection>

          <PolicySection title="6. Cookieの使用">
            <Text>
              本アプリでは、ユーザー認証のためにCookieを使用する場合があります。
            </Text>
          </PolicySection>

          <PolicySection title="7. セキュリティ">
            <Text>
              本アプリでは、ユーザー情報を保護するために適切なセキュリティ対策を講じていますが、完全な安全性を保証するものではありません。
            </Text>
          </PolicySection>

          <PolicySection title="8. プライバシーポリシーの変更">
            <Text>
              本プライバシーポリシーは予告なく変更される場合があります。変更後のポリシーは本アプリ上に掲載された時点で効力を生じるものとします。
            </Text>
          </PolicySection>

          <PolicySection title="9. お問い合わせ">
            <Text mb={4}>
              プライバシーに関するお問い合わせは、下記までご連絡ください。
            </Text>

            <Center>
              <BasicButton color="white" bg="black" asChild>
                <Link href="https://github.com/xmitoux/watchii" target="_blank">
                  <IoLogoGithub />
                  GitHub
                </Link>
              </BasicButton>
            </Center>
          </PolicySection>
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

type PolicySectionProps = {
  title: string;
  children: React.ReactNode;
};

function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <Box>
      <Heading size="lg" mb={2}>{title}</Heading>
      {children}
    </Box>
  );
}
