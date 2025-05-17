import { motion } from 'motion/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { Center, Text, VStack } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import PrefetchImage from '@/components/PrefetchImage';
import SignupConfirmCompleted from '@/features//Signup/Confirm/SignupConfirmCompleted';
import { usersApi } from '@/features/Signup/api/users-api';
import { useSessionToken } from '@/hooks/useSessionToken';

/** OAuthログイン処理コンポーネント */
export default function LoginWithOAuth() {
  const router = useRouter();
  const token = useRef<{ access_token: string; refresh_token: string } | null>(null);
  const { getSessionTokenData } = useSessionToken();

  useEffect(() => {
    const login = async () => {
      const tokenData = await getSessionTokenData();
      if (tokenData) {
        // セッション情報がある場合は、トークンを保存
        token.current = tokenData;
      }

      await handleLogin();
    };

    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isError, setIsError] = useState(false);

  /** ログイン処理 */
  async function handleLogin() {
    setIsError(false);

    try {
      // OAuthサインインAPI
      const { userExists } = await usersApi.signInWithOAuth({ token: token.current!.access_token });

      if (!userExists) {
        // 新規登録ユーザの場合は登録画面を表示
        setIsCompleted(true);
      }
      else {
        // ユーザが存在する場合は自動でホーム画面にリダイレクト
        router.push('/home');
      }
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
          <Layout title="登録確認" noFooter noMenu>
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

                    <BasicButton color="chiiWhite" bg="hachiBlue" onClick={handleLogin}>
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
