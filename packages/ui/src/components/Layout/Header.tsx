import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdArrowBackIos } from 'react-icons/md';

import { cherry_bomb_one, hachi_maru_pop } from '../../utils/fonts';
import { BasicButton } from '../Button/BasicButton';

type HeaderProps = {
  title: string;
  actionButton?: React.ReactNode;
  canBack?: boolean;
  color: string;
  onNavigationBack?: () => void;
};

const Header: React.FC<HeaderProps> = ({ title, actionButton, canBack, color, onNavigationBack }) => {
  const router = useRouter();

  function handleBack(e: React.MouseEvent) {
    e.stopPropagation();

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

  // ホームのタイトルだけは、Watchiiのロゴを表示
  const isWatchiiLogo = title === 'Watchii';

  function handleScrollToTop() {
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <Box
      className={hachi_maru_pop.className}
      bg={color}
      fontWeight={600}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="sticky"
      onClick={handleScrollToTop} // 擬似的なステータスバータップスクロール
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
            <BasicButton
              variant="plain"
              color="chiiWhite"
              w="40px"
              paddingLeft={0}
              tapScale={0.95}
              onClick={handleBack}
            >
              <MdArrowBackIos />
            </BasicButton>
          )}
        </Box>

        {/* タイトル（中央寄せ） */}
        <Text
          pb={1}
          color="chiiWhite"
          fontSize={isWatchiiLogo ? '2xl' : 'lg'}
          className={isWatchiiLogo ? cherry_bomb_one.className : undefined}
          textAlign="center"
        >
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
