import { useRouter } from 'next/router';
import React, { useState } from 'react';

import {
  Center,
  Field,
  Fieldset,
  Icon,
  Input,
  Stack,
} from '@repo/ui/chakra-ui';
import { PasswordInput } from '@repo/ui/chakra-ui/password-input';
import { toaster } from '@repo/ui/chakra-ui/toaster';
import { MdLock, MdMail } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import { BasicButton } from './Button/BasicButton';

type LoginProps = {
  homeUrl?: string;
  oAuthSigninProcessing?: boolean;
};
export function Login({ homeUrl = '/home', oAuthSigninProcessing }: LoginProps) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  /** ログイン処理 */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      // Supabaseでログイン処理
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }

      // ホーム画面にリダイレクト
      // (/home/page/1 には行かないよう注意！)
      // (本番環境だとなぜか固まる)
      router.push(homeUrl);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toaster.create({
        title: 'ログインに失敗しました😢',
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
    <>
      <Center>
        <form onSubmit={handleLogin}>
          <Fieldset.Root size="lg">
            <Stack>
              <Fieldset.Legend>ログイン</Fieldset.Legend>
              <Fieldset.HelperText>アカウント情報を入力してね！</Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
              <Field.Root required>
                <Field.Label>
                  <Icon><MdMail /></Icon>
                  メールアドレス
                  <Field.RequiredIndicator />
                </Field.Label>

                <Input value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
              </Field.Root>

              <Field.Root required>
                <Field.Label>
                  <Icon><MdLock /></Icon>
                  パスワード
                  <Field.RequiredIndicator />
                </Field.Label>

                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field.Root>
            </Fieldset.Content>

            <Center>
              <BasicButton
                color="chiiWhite"
                bg="hachiBlue"
                type="submit"
                disabled={email === '' || password === '' || oAuthSigninProcessing}
                loading={loading}
              >
                ログイン
              </BasicButton>
            </Center>
          </Fieldset.Root>
        </form>
      </Center>
    </>

  );
}
