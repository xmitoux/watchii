import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { Box, Center, Flex, Text, VStack } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import { usersApi } from '@/features/Signup/api/users-api';

import UserRegisterLoading from '../components/UserRegisterLoading';

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
      {isCompleted
        ? (
          // 登録完了表示
          <Flex direction="column" justify="center" align="center">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
              w="100vw"
              h="30vh"
              bgGradient="to-b"
              gradientFrom="hachiwareBlue"
              gradientTo="#6BBBD4"
            >
              <Text
                color="chiiWhite"
                fontSize={['3xl', '4xl']}
                fontWeight="bold"
                textShadow="0px 2px 3px rgba(0,0,0,0.1)"
              >
                登録完了！
              </Text>
              <Text
                color="chiiWhite"
                fontSize="xl"
                textShadow="0px 2px 3px rgba(0,0,0,0.1)"
              >
                Watchiiをお楽しみください！
              </Text>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="100%"
              h="40vh"
              my="-2px" // 画像の上下端に謎の線が入るので隠す
              bgGradient="to-b"
              gradientFrom="#6BBBD4"
              gradientTo="#ACE0EE"
            >
              <NextImage
                src="/images/user-registration-completed.webp"
                width={1000}
                height={0}
                style={{ width: '500px', height: 'auto' }}
                priority
                alt="登録完了！"
              />
            </Box>

            {/* 画像の謎の線対応のマイナスマージンの分高さを足す */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              w="100vw"
              h="calc(30vh + 4px)"
              bgGradient="to-b"
              gradientFrom="#ACE0EE"
              gradientTo="hachiBlue.light"
            >
              <Button
                variant="subtle"
                w={['240px', '280px']}
                h="56px"
                fontSize="lg"
                fontWeight="bold"
                borderRadius="full"
                boxShadow="0px 4px 10px rgba(0,0,0,0.15)"
                color="chiiWhite"
                bgColor="hachiwareBlue.dark"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
                }}
                transition="all 0.2s"
                asChild
              >
                <Link href="/home/page/1">はじめる！</Link>
              </Button>
            </Box>
          </Flex>
        )
        : (
          <Layout title="登録確認" noFooter noMenu>
            <Center>
              {isError
                ? (
                  // エラー表示
                  <VStack>
                    <Text color="red.500">登録確認に失敗しました。</Text>
                    <Text color="red.500">もう一度お試しください。</Text>
                    <Button color="chiiWhite" bg="hachiBlue" onClick={handleConfirm}>
                      再試行
                    </Button>
                  </VStack>
                )
                : (
                  // 登録中表示
                  <Flex direction="column" justify="center" align="center" minH="80vh">
                    <VStack maxW="600px" textAlign="center">
                      <Text color="blackPrimary" fontSize={['2xl', '3xl']} fontWeight="bold">登録を確認しています...</Text>
                      <UserRegisterLoading />
                    </VStack>
                  </Flex>
                )}
            </Center>
          </Layout>
        )}
    </>
  );
}
