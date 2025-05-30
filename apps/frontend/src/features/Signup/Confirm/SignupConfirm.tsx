import { motion } from 'motion/react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { Center, Text, VStack } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import PrefetchImage from '@/components/PrefetchImage';
import { usersApi } from '@/features/Signup/api/users-api';

import SignupConfirmCompleted from './SignupConfirmCompleted';

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
    }
    catch (error) {
      console.error('Error confirming signup:', error);
      setIsError(true);
    }
  }

  return (
    <>
      {isCompleted ? (
        // 登録完了表示
        <motion.div
          key="completed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          style={{ width: '100%', height: '100%' }}
        >
          <SignupConfirmCompleted />
        </motion.div>
      ) : (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeIn' } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          style={{ width: '100%', height: '100%' }}
        >
          <Layout title="登録確認" noFooter noMenu onNavigationBack={() => router.push('/signup')}>
            <Center>
              {isError ? (
                // エラー表示
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
                >
                  <VStack>
                    <Text color="red.500">登録確認に失敗しました。</Text>
                    <Text color="red.500">もう一度お試しください。</Text>

                    <BasicButton color="chiiWhite" bg="hachiBlue" onClick={handleConfirm}>
                      再試行
                    </BasicButton>
                  </VStack>
                </motion.div>
              ) : (
                // 登録中表示
                <LoadingScreen message="登録を確認しています" />
              )}
            </Center>
          </Layout>
        </motion.div>
      )}

      {/* 登録完了画像プリフェッチ用の隠し要素 */}
      <PrefetchImage src="/images/user-registration-completed.webp" width={1000} />
    </>
  );
}
