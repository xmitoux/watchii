import React, { useState } from 'react';

import {
  Center,
  Field,
  Fieldset,
  Icon,
  Input,
  Stack,
} from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { PasswordInput } from '@repo/ui/chakra-ui/password-input';
import { toaster } from '@repo/ui/chakra-ui/toaster';
import { MdLock, MdMail } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';

export default function Signup() {
  const supabase = createClient();

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
      toaster.create({
        title: '登録に失敗しました😢',
        description: error.message || 'もう一度試してみてね',
        type: 'error',
        duration: 3000,
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
          ? <p>登録確認用のメールを送信しました！</p>
          : (
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
          )}
      </Center>
    </Layout>
  );
}
