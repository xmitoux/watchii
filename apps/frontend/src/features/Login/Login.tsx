import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Box, Button, Flex, HStack, Separator, Text, VStack } from '@repo/ui/chakra-ui';
import { Center, Field, Fieldset, Input, Stack } from '@repo/ui/chakra-ui';
import { Login as BaseLogin } from '@repo/ui/components';
import { FcGoogle, IoLogoGithub, MdArrowBack, MdMail } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import { useToast } from '@/hooks/useToast';

// OAuthプロバイダーの型定義
type OAuthProvider = 'github' | 'google';

export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  const { showCompleteToast, showErrorToast } = useToast();

  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);

  // いずれかのログイン処理が実行中かどうか
  const isAnyLoginProcessing = oauthLoading !== null;

  useEffect(() => {
    // PWAでのOAuthログイン用の処理
    // (認証画面がアプリ内ブラウザで開いてしまい、元のこの画面のログイン処理が進まないため)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        if (!session) {
          return;
        }

        router.push('/home');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();

    try {
      setEmailSending(true);
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
      setEmailSending(false);
    }
  }

  /** OAuthプロバイダーでログイン */
  async function handleOAuthLogin(provider: OAuthProvider) {
    try {
      // signin処理が終わってもリダイレクトに時間がかかるのでずっとtrueにしておく
      // ただし、エラーが発生した場合はfalseにする
      setOauthLoading(provider);

      // Supabaseでログイン処理
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
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

      setOauthLoading(null);
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

              <Button
                type="submit"
                color="chiiWhite"
                bg="hachiBlue"
                width="100%"
                disabled={email === '' || isAnyLoginProcessing}
                loading={emailSending}
              >
                メールを送信
              </Button>
            </Fieldset.Root>
          </form>

          <Button variant="ghost" color="blackPrimary" onClick={handleSwitchLoginMode} disabled={isAnyLoginProcessing}>
            <MdArrowBack />
            ログイン画面に戻る
          </Button>
        </Flex>
      ) : (
        // 通常のログインフォーム
        <>
          <BaseLogin oAuthSigninProcessing={isAnyLoginProcessing} />

          <Center mt={6}>
            <Text color="blackPrimary" fontSize="sm">
              パスワードを忘れた場合は
            </Text>
            <Text
              color="hachiwareBlue.dark"
              fontSize="sm"
              cursor={isAnyLoginProcessing ? 'not-allowed' : 'pointer'}
              opacity={isAnyLoginProcessing ? 0.5 : 1}
              _hover={{ textDecoration: isAnyLoginProcessing ? 'none' : 'underline' }}
              onClick={() => !isAnyLoginProcessing && setIsResetMode(true)}
            >
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
            <Button
              bg="black"
              width="220px"
              loading={oauthLoading === 'github'}
              disabled={isAnyLoginProcessing && oauthLoading !== 'github'}
              onClick={() => handleOAuthLogin('github')}
            >
              <IoLogoGithub />
              GitHubでログイン
            </Button>

            <Button
              variant="surface"
              bg="white"
              width="220px"
              loading={oauthLoading === 'google'}
              onClick={() => handleOAuthLogin('google')}
              disabled={isAnyLoginProcessing && oauthLoading !== 'google'}
            >
              <FcGoogle />
              <Text color="blackPrimary">Googleでログイン</Text>
            </Button>
          </VStack>
        </>
      )}
    </Layout>
  );
}
