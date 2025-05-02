import NextImage from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import { Box, Button, ButtonProps, Flex, Icon, Text, VStack } from '@repo/ui/chakra-ui';
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
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      h="100vh"
      bg="hachiBlue"
      py={8}
      position="relative"
    >
      {/* ロゴ */}
      <Box pt={8} mb={-8} textAlign="center">
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
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        overflow="hidden"
      >
        <NextImage
          src="/images/lp.webp"
          width={1000}
          height={0}
          style={{ width: '500px', height: 'auto' }}
          priority
          alt="Watchii cute characters"
        />
      </Box>

      {/* ボタン部分 */}
      <VStack gap={4} pb={8}>
        <ButtonComponent to="/login">
          <Icon><MdLogin /></Icon>
          ログイン
        </ButtonComponent>
        <ButtonComponent to="/signup" variant="subtle" bgColor="white/80">
          <Icon><MdAccountCircle /></Icon>
          新規登録
        </ButtonComponent>
      </VStack>
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
  bgColor?: string;
  to: string;
  children: React.ReactNode;
};

function ButtonComponent({ variant, bgColor, to, children }: ButtonComponent) {
  return (
    <Button
      colorPalette="cyan"
      variant={variant}
      w={['240px', '280px']}
      h="56px"
      fontSize="lg"
      fontWeight="bold"
      borderRadius="full"
      boxShadow="0px 4px 10px rgba(0,0,0,0.15)"
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
