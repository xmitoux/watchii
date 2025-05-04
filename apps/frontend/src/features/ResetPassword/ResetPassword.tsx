import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Center, Field, Fieldset, Flex, Icon, Stack } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { PasswordInput } from '@repo/ui/chakra-ui/password-input';
import { MdLock } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import MessageWithImage from '@/components/MessageWithImage';
import PrefetchImage from '@/components/PrefetchImage';
import { useToast } from '@/hooks/useToast';

const supabase = createClient();

export default function Login() {
  const router = useRouter();
  const { showErrorToast } = useToast();

  const [canReset, setCanReset] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token_hash = router.query.token_hash as string;
      if (!token_hash) {
        return;
      }

      // メールのリセットリンクのトークンを検証して認証
      const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: 'email' });
      if (!data || error) {
        showErrorToast({
          message: 'トークンの検証に失敗しました😢',
          errorMessage: error?.message,
        });

        router.push('/login');
      }

      setCanReset(true);
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  /** パスワードリセット処理 */
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw error;
      }

      setResetPasswordSuccess(true);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'パスワードリセットに失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      setLoading(false);
    }
  }

  return (
    canReset
      ? (
        <Layout title="パスワードリセット" canBack noFooter noMenu>
          <Center>
            {resetPasswordSuccess
              ? (
                // パスワードリセット成功画面
                <motion.div
                  key="completed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  <Flex direction="column" justify="center" align="center" minH="75vh">
                    <MessageWithImage
                      title="パスワードがリセットされました"
                      messages={['新しいパスワードでログインしてください。']}
                      imageSrc="/images/reset-password-completed.webp"
                    />

                    <motion.div whileTap={{ scale: 0.97 }}>
                      <Button
                        color="chiiWhite"
                        bg="hachiwareBlue.dark"
                        w={['240px', '280px']}
                        h="56px"
                        fontSize="lg"
                        fontWeight="bold"
                        borderRadius="full"
                        boxShadow="0px 4px 10px rgba(0,0,0,0.15)"
                        _hover={{
                          transform: 'translateY(-4px)',
                          boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
                        }}
                        transition="all 0.2s"
                        asChild
                      >
                        <Link href="/login">ログイン画面へ</Link>
                      </Button>
                    </motion.div>
                  </Flex>
                </motion.div>
              )
              : (
                // パスワードリセットフォーム
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeIn' } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                >
                  <form onSubmit={handleResetPassword}>
                    <Fieldset.Root size="lg">
                      <Stack>
                        <Fieldset.Legend>パスワードリセット</Fieldset.Legend>
                        <Fieldset.HelperText>パスワードを入力してください</Fieldset.HelperText>
                      </Stack>

                      <Fieldset.Content>
                        <Field.Root required>
                          <Field.Label>
                            <Icon><MdLock /></Icon>
                            パスワード
                            <Field.RequiredIndicator />
                          </Field.Label>

                          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Field.Root>
                      </Fieldset.Content>

                      <Button
                        color="chiiWhite"
                        bg="hachiBlue"
                        type="submit"
                        disabled={password === ''}
                        loading={loading}
                      >
                        リセットする
                      </Button>
                    </Fieldset.Root>
                  </form>
                </motion.div>

              )}
          </Center>

          {/* 画像プリフェッチ用の隠し要素 */}
          <PrefetchImage src="/images/reset-password-completed.webp" width={1000} />
        </Layout>
      )
      : null
  );
}
