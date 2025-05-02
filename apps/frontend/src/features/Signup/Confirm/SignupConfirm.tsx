import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { Center, Text, VStack } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import { usersApi } from '@/features/Signup/api/users-api';

export default function SignupConfirm() {
  const router = useRouter();
  const token = useRef<string | null>(null);

  // ページロード時に自動で登録処理を実行
  useEffect(() => {
    const tokenFromQuery = router.query.token_hash as string;
    if (tokenFromQuery) {
      // 再試行用にトークンを保存しておく
      token.current = tokenFromQuery;
      handleConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const supabase = createClient();

  const [isCompleted, setIsCompleted] = useState(false);
  const [isError, setIsError] = useState(false);

  /** 登録確認処理 */
  async function handleConfirm() {
    setIsError(false);

    try {
      // ユーザ登録API
      const { session } = await usersApi.registerUser({ token: token.current! });

      // 登録結果のセッションを保存してログイン
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (sessionError) {
        console.error('Error setting session:', sessionError);
        setIsError(true);
        return;
      }

      // 登録完了フラグをセット
      setIsCompleted(true);

      // 自動でホームページへ遷移
      setTimeout(() => {
        router.push('/home/page/1');
      }, 3000);
    }
    catch (error) {
      console.error('Error confirming signup:', error);
      setIsError(true);
    }
  }

  return (
    <Layout title="登録確認" noFooter noMenu>
      <Center>
        {isError
          ? (
            <VStack>
              <Text color="red.500">登録確認に失敗しました。</Text>
              <Text color="red.500">もう一度お試しください。</Text>
              <Button color="chiiWhite" bg="hachiBlue" onClick={handleConfirm}>
                再試行
              </Button>
            </VStack>
          )
          : isCompleted
            ? (
              <VStack textAlign="center" p={4}>
                <Text>登録完了しました！ 🎉</Text>
                <Text>自動でホームページに移動します。</Text>
              </VStack>
            )
            : (
              <Text>登録を確認しています...</Text>
            )}
      </Center>
    </Layout>
  );
}
