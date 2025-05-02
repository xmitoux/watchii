import NextImage from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import { Box, Button, ButtonProps, Flex, Icon, Text } from '@repo/ui/chakra-ui';
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
        <Text
          className={cherry_bomb_one.className}
          color="chiiWhite"
          fontSize="7xl"
          textShadow="0px 2px 3px rgba(0,0,0,0.1)"
        >
          Watchii
        </Text>
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
      >
        <NextImage
          src="/images/lp.webp"
          width={1000}
          height={0}
          style={{ width: '500px', height: 'auto', paddingBottom: '40px' }}
          priority
          alt="Watchii cute characters"
        />
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
        gradientTo="hachiBlue.light"
      >
        <ButtonComponent to="/login" color="chiiWhite" bgColor="hachiwareBlue.dark">
          <Icon><MdLogin /></Icon>
          ログイン
        </ButtonComponent>
        <ButtonComponent to="/signup" color="hachiwareBlue.dark" variant="subtle" bgColor="chiiWhite">
          <Icon><MdAccountCircle /></Icon>
          新規登録
        </ButtonComponent>
      </Box>
    </Flex>
  );
}

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
        transform: 'translateY(-2px)',
        boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
      }}
      transition="all 0.2s"
      asChild
    >
      <Link href={to}>{children}</Link>
    </Button>
  );
}
