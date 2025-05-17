// pages/signup.tsx
import { motion } from 'motion/react';
import Link from 'next/link';
import React, { useState } from 'react';

import { Box, Center, Container, Field, Fieldset, Flex, HStack, Icon, Input, Separator, Stack, Text, VStack } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { FcGoogle, IoLogoGithub, MdMail } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import MessageWithImage from '@/components/MessageWithImage';
import { PasswordFields } from '@/components/PasswordFields';
import PrefetchImage from '@/components/PrefetchImage';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useToast } from '@/hooks/useToast';

// OAuthプロバイダーの型定義
type OAuthProvider = 'github' | 'google';

export default function Signup() {
  const supabase = createClient();
  const { showErrorToast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // パスワードバリデーションフックを使用
  const {
    password,
    confirmPassword,
    passwordTouched,
    confirmTouched,
    isValidFormat,
    isLongEnough,
    passwordsMatch,
    handlePasswordChange,
    handleConfirmChange,
    handlePasswordBlur,
    handleConfirmBlur,
    isFormValid: isPasswordValid,
  } = usePasswordValidation();

  // フォーム全体の有効性
  const isFormValid = email !== '' && isPasswordValid;

  /** サインアップ処理 */
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (email === '') {
        throw new Error('メールアドレスを入力してください');
      }

      if (password.length < 8) {
        throw new Error('パスワードは8文字以上で入力してください');
      }

      if (!isValidFormat) {
        throw new Error('パスワードは半角英数字記号のみで入力してください');
      }

      if (password !== confirmPassword) {
        throw new Error('パスワードと確認用パスワードが一致しません');
      }

      // Supabaseでサインアップ処理
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw error;
      }

      setSignUpSuccess(true);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: '登録に失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      setLoading(false);
    }
  }

  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  // いずれかのログイン処理が実行中かどうか
  const isAnyLoginProcessing = loading || oauthLoading !== null;

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

  return (
    <Layout title="新規登録" canBack noFooter noMenu>
      <Container maxW="xl">
        <Center>
          {signUpSuccess
            ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <MessageWithImage
                  title="登録確認用のメールを送信しました！"
                  messages={['メール内のリンクをクリックして', '登録を完了してください']}
                  imageSrc="/images/signup-mail-sent.webp"
                />
              </motion.div>
            )
            : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeIn' } }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <form onSubmit={handleSignup}>
                  <Fieldset.Root size="lg">
                    <Stack>
                      <Fieldset.Legend>登録</Fieldset.Legend>
                      <Fieldset.HelperText>アカウント情報を入力してね</Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                      <Field.Root required>
                        <Field.Label>
                          <Icon><MdMail /></Icon>
                          メールアドレス
                          <Field.RequiredIndicator />
                        </Field.Label>

                        <Input
                          value={email}
                          type="email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Field.Root>

                      {/* 共通パスワードフィールドコンポーネントを使用 */}
                      <PasswordFields
                        password={password}
                        confirmPassword={confirmPassword}
                        passwordTouched={passwordTouched}
                        confirmTouched={confirmTouched}
                        isValidFormat={isValidFormat}
                        isLongEnough={isLongEnough}
                        passwordsMatch={passwordsMatch}
                        handlePasswordChange={handlePasswordChange}
                        handleConfirmChange={handleConfirmChange}
                        handlePasswordBlur={handlePasswordBlur}
                        handleConfirmBlur={handleConfirmBlur}
                      />
                    </Fieldset.Content>

                    <Center>
                      <BasicButton
                        color="chiiWhite"
                        bg="hachiBlue"
                        type="submit"
                        disabled={!isFormValid || oauthLoading !== null}
                        loading={loading}
                      >
                        登録
                      </BasicButton>
                    </Center>
                  </Fieldset.Root>
                </form>

                <Flex align="center" justify="center" mt={6}>
                  <Box w="100px"><Separator /></Box>
                  <Text fontSize="sm" color="blackPrimary">または</Text>
                  <Box w="100px"><Separator /></Box>
                </Flex>

                <VStack mt={6} gap={4}>
                  <BasicButton
                    bg="black"
                    loading={oauthLoading === 'github'}
                    disabled={isAnyLoginProcessing && oauthLoading !== 'github'}
                    onClick={() => handleOAuthLogin('github')}
                  >
                    <IoLogoGithub />
                    GitHubでログイン
                  </BasicButton>

                  <BasicButton
                    variant="surface"
                    bg="white"
                    loading={oauthLoading === 'google'}
                    disabled={isAnyLoginProcessing && oauthLoading !== 'google'}
                    onClick={() => handleOAuthLogin('google')}
                  >
                    <FcGoogle />
                    <Text color="blackPrimary">Googleでログイン</Text>
                  </BasicButton>
                </VStack>

                <Center mt={6}>
                  <HStack gap={2}>
                    <TextLink text="利用規約" to="/about/terms-of-use" isLoginProcessing={isAnyLoginProcessing} />
                    <Separator orientation="vertical" height="4" size="md" />
                    <TextLink text="プライバシーポリシー" to="/about/privacy-policy" isLoginProcessing={isAnyLoginProcessing} />
                  </HStack>
                </Center>
              </motion.div>
            )}
        </Center>
      </Container>

      {/* 画像プリフェッチ用の隠し要素 */}
      <PrefetchImage src="/images/signup-mail-sent.webp" width={1000} />
    </Layout>
  );
}

type TextLinkProps = {
  text: string;
  to: string;
  isLoginProcessing: boolean;
};

function TextLink({ text, to, isLoginProcessing }: TextLinkProps) {
  return (
    <Text
      color="hachiwareBlue.dark"
      fontSize="sm"
      cursor={isLoginProcessing ? 'not-allowed' : 'pointer'}
      opacity={isLoginProcessing ? 0.5 : 1}
      _hover={{ textDecoration: isLoginProcessing ? 'none' : 'underline' }}
      asChild
    >
      <Link href={to}>
        {text}
      </Link>
    </Text>
  );
}
