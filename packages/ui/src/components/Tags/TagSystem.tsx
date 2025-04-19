import Link from 'next/link';

import { Text } from '@repo/ui/chakra-ui';
import { useColorMode } from '@repo/ui/chakra-ui/color-mode';
import { Tag } from '@repo/ui/chakra-ui/tag';

// 共通の型定義
type TagColorScheme = {
  bg: string;
  hover: string;
  border: string;
  text: string;
  glow?: string;
};

// パステルカラーパレット - ライトモード用(9色)
const PASTEL_TAG_COLORS_LIGHT: TagColorScheme[] = [
  { bg: 'pink.100', hover: 'pink.200', border: 'pink.300', text: 'pink.800', glow: 'pink.300' },
  { bg: 'purple.100', hover: 'purple.200', border: 'purple.300', text: 'purple.800', glow: 'purple.300' },
  { bg: 'blue.100', hover: 'blue.200', border: 'blue.300', text: 'blue.800', glow: 'blue.300' },
  { bg: 'teal.100', hover: 'teal.200', border: 'teal.300', text: 'teal.800', glow: 'teal.300' },
  { bg: 'green.100', hover: 'green.200', border: 'green.300', text: 'green.800', glow: 'green.300' },
  { bg: 'yellow.100', hover: 'yellow.200', border: 'yellow.300', text: 'yellow.800', glow: 'yellow.300' },
  { bg: 'orange.100', hover: 'orange.200', border: 'orange.300', text: 'orange.800', glow: 'orange.300' },
  { bg: 'red.100', hover: 'red.200', border: 'red.300', text: 'red.800', glow: 'red.300' },
  { bg: 'cyan.100', hover: 'cyan.200', border: 'cyan.300', text: 'cyan.800', glow: 'cyan.300' },
];

// ネオンカラーパレット - ダークモード用(9色)
const NEON_TAG_COLORS_DARK: TagColorScheme[] = [
  { bg: 'gray.900', hover: 'gray.950', border: 'pink.400', text: 'pink.300', glow: 'pink.400' },
  { bg: 'gray.900', hover: 'gray.950', border: 'purple.400', text: 'purple.300', glow: 'purple.400' },
  { bg: 'gray.900', hover: 'gray.950', border: 'blue.400', text: 'blue.300', glow: 'blue.400' },
  { bg: 'gray.900', hover: 'gray.950', border: 'teal.400', text: 'teal.300', glow: 'teal.400' },
  { bg: 'gray.900', hover: 'gray.950', border: 'green.400', text: 'green.300', glow: 'green.400' },
  { bg: 'gray.900', hover: 'gray.950', border: 'yellow.400', text: 'yellow.300', glow: 'yellow.400' },
  { bg: 'gray.900', hover: 'gray.950', border: 'orange.400', text: 'orange.300', glow: 'orange.400' },
  { bg: 'gray.900', hover: 'gray.950', border: 'red.400', text: 'red.300', glow: 'red.400' },
  { bg: 'gray.900', hover: 'gray.950', border: 'cyan.400', text: 'cyan.300', glow: 'cyan.400' },
];

// 未選択状態のスタイル - ライトモード
const UNSELECTED_LIGHT: TagColorScheme = {
  bg: 'gray.100',
  hover: 'gray.200',
  border: 'gray.300',
  text: 'gray.500',
  glow: 'gray.300',
};

// 未選択状態のスタイル - ダークモード
const UNSELECTED_DARK: TagColorScheme = {
  bg: 'gray.800',
  hover: 'gray.700',
  border: 'gray.600',
  text: 'gray.400',
  glow: 'gray.500',
};

// 基本的なタグプロパティ
interface BaseTagProps {
  id: number;
  name: string;
  isSelected?: boolean;
  startElement?: React.ReactNode;
  onClick?: () => void;
}

// 基本タグコンポーネント
export function BaseTag({
  id,
  name,
  isSelected = true, // デフォルトは選択状態
  startElement,
  onClick,
}: BaseTagProps) {
  // 現在のカラーモードを取得
  const { colorMode } = useColorMode();

  // タグごとに固定のカラーを選ぶ（タグのIDに基づく）
  const colorIndex = id % 9; // 9色に限定

  // カラーモードに応じてカラーパレットを選択
  const selectedTagColors = colorMode === 'dark' ? NEON_TAG_COLORS_DARK : PASTEL_TAG_COLORS_LIGHT;
  const unselectedTagColors = colorMode === 'dark' ? UNSELECTED_DARK : UNSELECTED_LIGHT;

  // 選択状態に応じてスタイルを設定
  const tagColor = isSelected ? selectedTagColors[colorIndex]! : unselectedTagColors;

  // ダークモード時のネオン効果用のスタイル
  const darkModeStyles = colorMode === 'dark'
    ? {
      boxShadow: `0 0 10px ${tagColor.glow}`,
      _hover: {
        bg: tagColor.hover,
        transform: 'translateY(-2px) scale(1.03)',
        boxShadow: `0 0 15px ${tagColor.glow}`,
      },
    }
    : {
      boxShadow: 'sm',
      _hover: {
        bg: tagColor.hover,
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      },
    };

  return (
    <Tag
      size="lg"
      variant="solid"
      bg={tagColor.bg}
      borderWidth="1px"
      borderColor={tagColor.border}
      borderRadius="full"
      py={2}
      px={4}
      cursor="pointer"
      transition="all 0.3s"
      startElement={startElement}
      {...darkModeStyles}
      onClick={onClick}
    >
      <Text color={tagColor.text} fontSize="md">
        {name}
      </Text>
    </Tag>
  );
}

// CuteTagの型定義
type CuteTagProps = {
  id: number;
  name: string;
  to: string;
};

/** かわいいタグコンポーネント(リンク機能つき) */
export function CuteLinkTag({ id, name, to }: CuteTagProps) {
  return (
    <Link href={to}>
      <BaseTag id={id} name={name} />
    </Link>
  );
}

type PostTagProps = {
  id: number;
  name: string;
  isSelected: boolean;
  startElement?: React.ReactNode;
  onClick?: () => void;
};

/** かわいいタグコンポーネント(Form用、選択状態を持つ) */
export function CuteFormTag({ ...props }: PostTagProps) {
  return (
    <BaseTag {...props} />
  );
}
