import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdArrowBackIos } from 'react-icons/md';

import { hachi_maru_pop } from '../../utils/fonts';

type HeaderProps = {
  title: string;
  actionButton?: React.ReactNode;
  canBack?: boolean;
  onNavigationBack?: () => void;
};

const Header: React.FC<HeaderProps> = ({ title, actionButton, canBack, onNavigationBack }) => {
  const router = useRouter();

  function handleBack() {
    // 戻るボタンが押されたときの処理
    if (onNavigationBack) {
      // カスタムの戻る処理があればそれを実行
      // (エピソード詳細からエピソード一覧の元ページに戻る場合など)
      onNavigationBack();
    }
    else if (canBack) {
      router.back();
    }
  }

  return (
    <Box
      className={hachi_maru_pop.className}
      bg="hachiBlue"
      fontWeight={600}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="sticky"
    >
      {/* メインヘッダー部分 */}
      <Flex
        px={4}
        justify="space-between"
        align="center"
        height="50px"
      >
        {/* 戻るボタン */}
        <Box width="40px">
          {(onNavigationBack || canBack) && (
            <Button variant="plain" color="chiiWhite" paddingLeft={0} onClick={handleBack}>
              <MdArrowBackIos />
            </Button>
          )}
        </Box>

        {/* タイトル（中央寄せ） */}
        <Text pb={1} color="chiiWhite" fontSize="lg" textAlign="center">
          {title}
        </Text>

        {/* 右端のアクションボタン */}
        <Box width="40px">
          {actionButton}
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
