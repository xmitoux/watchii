import { motion } from 'motion/react';
import React, { useState } from 'react';

import { Center, Field, Fieldset, Icon, Input, Stack } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { PasswordInput } from '@repo/ui/chakra-ui/password-input';
import { MdLock, MdMail } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import MessageWithImage from '@/components/MessageWithImage';
import PrefetchImage from '@/components/PrefetchImage';
import { useToast } from '@/hooks/useToast';

export default function Signup() {
  const supabase = createClient();
  const { showErrorToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  /** サインアップ処理 */
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

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

  return (
    <Layout title="新規登録" canBack noFooter noMenu>
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
                messages={['メール内のリンクをクリックして', '登録を完了してください！']}
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
                    <Fieldset.HelperText>アカウント情報を入力してね！</Fieldset.HelperText>
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

                    <Field.Root required>
                      <Field.Label>
                        <Icon><MdLock /></Icon>
                        パスワード
                        <Field.RequiredIndicator />
                      </Field.Label>

                      <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Field.Root>
                  </Fieldset.Content>

                  <Button
                    color="chiiWhite"
                    bg="hachiBlue"
                    type="submit"
                    disabled={email === '' || password === ''}
                    loading={loading}
                  >
                    登録
                  </Button>
                </Fieldset.Root>
              </form>
            </motion.div>
          )}
      </Center>

      {/* 画像プリフェッチ用の隠し要素 */}
      <PrefetchImage src="/images/signup-mail-sent.webp" width={1000} />
    </Layout>
  );
}
