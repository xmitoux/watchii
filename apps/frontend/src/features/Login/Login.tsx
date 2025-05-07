import { useState } from 'react';

import { Box, Button, Flex, HStack, Separator, Text, VStack } from '@repo/ui/chakra-ui';
import { Center, Field, Fieldset, Input, Stack } from '@repo/ui/chakra-ui';
import { Login as BaseLogin } from '@repo/ui/components';
import { IoLogoGithub, MdArrowBack, MdMail } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import { useToast } from '@/hooks/useToast';

export default function Login() {
  const supabase = createClient();
  const { showCompleteToast, showErrorToast } = useToast();

  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      showCompleteToast('パスワードリセットメールを送信しました✉️');

      // 成功したらログインモードに戻る
      handleSwitchLoginMode();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'メール送信に失敗しました😢',
        errorMessage: error?.message,
      });
    }
    finally {
      setLoading(false);
    }
  }

  const [isGitHubLoginLoading, setGitHubLoginLoading] = useState(false);

  /** GitHubでログイン */
  async function handleGitHubLogin() {
    try {
      // signin処理が終わってもリダイレクトに時間がかかるのでずっとtrueにしておく
      // ただし、エラーが発生した場合はfalseにする
      setGitHubLoginLoading(true);

      // Supabaseでログイン処理
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/login-with-oauth`,
        },
      });
      if (error) {
        throw error;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'ログインに失敗しました😢',
        errorMessage: error.message || 'もう一度試してみてね',
      });

      setGitHubLoginLoading(false);
    }
  }

  function handleSwitchLoginMode() {
    setIsResetMode(false);
    setEmail('');
  }

  return (
    <Layout title="ログイン" canBack noFooter noMenu>
      {isResetMode ? (
        // パスワードリセットフォーム
        <Flex direction="column" alignItems="center" justifyContent="center" gap={4}>
          <form onSubmit={handleResetPassword}>
            <Fieldset.Root size="lg">
              <Stack>
                <Fieldset.Legend>パスワードリセット</Fieldset.Legend>
                <Fieldset.HelperText>
                  指定されたメールアドレス宛に、
                  <br />
                  パスワード再設定用のリンクを送信します
                </Fieldset.HelperText>
              </Stack>

              <Fieldset.Content>
                <Field.Root required>
                  <Field.Label>
                    <MdMail />
                    メールアドレス
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
                </Field.Root>
              </Fieldset.Content>

              <Button type="submit" color="chiiWhite" bg="hachiBlue" width="100%" disabled={email === ''} loading={loading}>
                メールを送信
              </Button>
            </Fieldset.Root>
          </form>

          <Button variant="ghost" color="blackPrimary" onClick={handleSwitchLoginMode}>
            <MdArrowBack />
            ログイン画面に戻る
          </Button>
        </Flex>
      ) : (
        // 通常のログインフォーム
        <>
          <BaseLogin />

          <Center mt={6}>
            <Text color="blackPrimary" fontSize="sm">
              パスワードを忘れた場合は
            </Text>
            <Text color="hachiwareBlue.dark" fontSize="sm" cursor="pointer" _hover={{ textDecoration: 'underline' }} onClick={() => setIsResetMode(true)}>
              こちら
            </Text>
          </Center>

          <Box mt={6} px="15vw">
            <HStack>
              <Separator flex="1" />
              <Text fontSize="sm" color="blackPrimary">または</Text>
              <Separator flex="1" />
            </HStack>
          </Box>

          <VStack mt={6} gap={4}>
            <Button bg="black" loading={isGitHubLoginLoading} onClick={handleGitHubLogin}>
              <IoLogoGithub />
              GitHubでログイン
            </Button>
          </VStack>
        </>
      )}
    </Layout>
  );
}
