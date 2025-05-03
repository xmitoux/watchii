import { motion } from 'motion/react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Box, Button, ButtonProps, Flex, Text } from '@repo/ui/chakra-ui';
import { useColorMode } from '@repo/ui/chakra-ui/color-mode';
import { MdAccountCircle, MdLogin } from '@repo/ui/icons';
import { cherry_bomb_one, hachi_maru_pop } from '@repo/ui/utils';

/** ランディングページ */
export default function Welcome() {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    // 強制的にライトモードに設定
    setColorMode('light');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // アニメーションの状態管理
  const [animationState, setAnimationState] = useState('initial');

  // 最初のアニメーション後にfloatアニメーションを開始
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('float');
    }, 2000); // 2秒後にfloatアニメーションを開始

    return () => clearTimeout(timer);
  }, []);

  return (
    <Flex direction="column" align="center" justify="center">
      {/* ロゴ */}
      <Box
        pt={12}
        w="100%"
        h="30vh"
        textAlign="center"
        bgGradient="to-b"
        gradientFrom="hachiwareBlue"
        gradientTo="#6BBBD4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }}
        >
          <Text
            className={cherry_bomb_one.className}
            color="chiiWhite"
            fontSize="7xl"
            textShadow="0px 2px 3px rgba(0,0,0,0.1)"
          >
            Watchii
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.8 } }}
        >
          <Box
            className={cherry_bomb_one.className}
            color="chiiWhite"
            fontSize="2xl"
            textShadow="0px 2px 3px rgba(0,0,0,0.1)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <LogoCaptionTilde mr />
            ちいかわがよめるアプリ
            <LogoCaptionTilde ml />
          </Box>
        </motion.div>
      </Box>

      {/* イラスト部分 */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        h="40vh"
        my="-2px" // 画像の上下端に謎の線が入るので隠す
        bgGradient="to-b"
        gradientFrom="#6BBBD4"
        gradientTo="#ACE0EE"
        position="relative"
        overflow="hidden"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={
            animationState === 'initial'
              ? { scale: 1, opacity: 1, transition: { delay: 0.6, duration: 0.7, type: 'spring', stiffness: 100 } }
              : { scale: [1, 1.05, 1], opacity: 1, transition: { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }
          }
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <NextImage
            src="/images/lp.webp"
            width={1000}
            height={0}
            style={{ width: '500px', height: 'auto', paddingBottom: '40px' }}
            priority
            alt="Watchii cute characters"
          />
        </motion.div>
      </Box>

      {/* ボタン部分 */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
        w="100%"
        h="calc(30vh + 4px)"
        pb={12}
        bgGradient="to-b"
        gradientFrom="#ACE0EE"
        gradientTo="hachiwareBlue.light"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 1.2, duration: 0.6 } }}
          whileTap={{ scale: 0.97 }}
        >
          <ButtonComponent to="/login" color="chiiWhite" bgColor="hachiwareBlue.dark">
            <MdLogin />
            ログイン
          </ButtonComponent>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 1.4, duration: 0.6 } }}
          whileTap={{ scale: 0.97 }}
        >
          <ButtonComponent to="/signup" color="hachiwareBlue.dark" variant="subtle" bgColor="chiiWhite">
            <MdAccountCircle />
            新規登録
          </ButtonComponent>
        </motion.div>
      </Box>
    </Flex>
  );
}

// チルダ（～）部分
function LogoCaptionTilde({ mr, ml }: { mr?: boolean; ml?: boolean }) {
  return (
    <Text
      className={hachi_maru_pop.className}
      fontWeight="bold"
      color="chiiWhite"
      fontSize="2xl"
      textShadow="0px 1px 2px rgba(0,0,0,0.1)"
      mr={mr ? 1 : 0}
      ml={ml ? 1 : 0}
    >
      ～
    </Text>
  );
}

type ButtonComponent = {
  variant?: ButtonProps['variant'];
  color?: string;
  bgColor?: string;
  to: string;
  children: React.ReactNode;
};

function ButtonComponent({ variant, color, bgColor, to, children }: ButtonComponent) {
  return (
    <Button
      variant={variant}
      w={['240px', '280px']}
      h="56px"
      fontSize="lg"
      fontWeight="bold"
      borderRadius="full"
      boxShadow="0px 4px 10px rgba(0,0,0,0.15)"
      color={color}
      bgColor={bgColor}
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
      }}
      transition="all 0.2s"
      asChild
    >
      <Link href={to}>{children}</Link>
    </Button>
  );
}
