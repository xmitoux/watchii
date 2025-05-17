import { Box, Text } from '@chakra-ui/react';
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
    // 最上部にスクロールが発火しないようにする
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

  return (
    <Box
      className={hachi_maru_pop.className}
      bg={color}
      fontWeight={600}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex={1300} // メニュードロワー(1400)より上にする
    >
      {/* メインヘッダー部分 */}
      <Box h="40px" position="relative">
        {/* 戻るボタン */}
        <Box
          w="60px" // 見た目より広くしてタップしやすくする
          position="absolute"
          left="10px"
          top="50%"
          transform="translateY(-50%)"
        >
          {(onNavigationBack || canBack) && (
            <BasicButton
              variant="plain"
              color="chiiWhite"
              w="50px"
              tapScale={0.9}
              onClick={handleBack}
            >
              <MdArrowBackIos />
            </BasicButton>
          )}
        </Box>

        {/* タイトル（中央寄せ） */}
        <Box
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)" // これが中央配置の鍵！🔑
          width="70%" // 幅を制限して左右のボタンと被らないようにする
          textAlign="center"
        >
          <Text
            className={isWatchiiLogo ? cherry_bomb_one.className : undefined}
            color="chiiWhite"
            fontSize={isWatchiiLogo ? '2xl' : 'lg'}
            textAlign="center"
            pb={1}
          >
            {title}
          </Text>
        </Box>

        {/* 右端のアクションボタン */}
        <Box
          w="60px" // 見た目より広くしてタップしやすくする
          display="flex"
          justifyContent="end"
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
        >
          {actionButton}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
