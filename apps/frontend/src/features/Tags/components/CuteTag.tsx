import { Text } from '@repo/ui/chakra-ui';
import { Tag } from '@repo/ui/chakra-ui/tag';
import { TagEntity } from '@repo/ui/types';

/** かわいいタグコンポーネント */
export function CuteTag({ tag }: { tag: TagEntity }) {
  // カラーパレット - パステルカラーをランダムに選択
  const tagColors = [
    { bg: 'pink.100', hover: 'pink.200', border: 'pink.300', text: 'pink.800' },
    { bg: 'purple.100', hover: 'purple.200', border: 'purple.300', text: 'purple.800' },
    { bg: 'blue.100', hover: 'blue.200', border: 'blue.300', text: 'blue.800' },
    { bg: 'teal.100', hover: 'teal.200', border: 'teal.300', text: 'teal.800' },
    { bg: 'green.100', hover: 'green.200', border: 'green.300', text: 'green.800' },
    { bg: 'yellow.100', hover: 'yellow.200', border: 'yellow.300', text: 'yellow.800' },
    { bg: 'orange.100', hover: 'orange.200', border: 'orange.300', text: 'orange.800' },
  ];

  // タグごとに固定のカラーを選ぶ（タグのIDに基づく）
  const colorIndex = tag.id % tagColors.length;
  const tagColor = tagColors[colorIndex];

  // プリフェッチ用のリンク
  const prefetchLink = `/tags/tag/${tag.id}/page/1`;

  // TODO: Linkを使用するときに削除する
  function handleLinkClick() {
    if (typeof window !== 'undefined') {
      window.location.href = prefetchLink;
    }
  }

  return (
    <Tag
      size="lg"
      variant="solid"
      bg={tagColor.bg}
      borderWidth="1px"
      borderColor={tagColor.border}
      borderRadius="full"
      boxShadow="sm"
      py={2}
      px={4}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        bg: tagColor.hover,
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
      onClick={handleLinkClick}
    >
      <Text color={tagColor.text} fontSize="md">
        {tag.name}
      </Text>
    </Tag>
  );
}
