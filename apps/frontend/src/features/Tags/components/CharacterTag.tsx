import { Box, Flex, Text } from '@repo/ui/chakra-ui';
import { CharacterEntity } from '@repo/ui/types';

import { CharacterIcon } from '@/components/CharacterIcon';

type CharacterTagProps = {
  character: CharacterEntity;
};

/** キャラクタータグコンポーネント */
export function CharacterTag({ character }: CharacterTagProps) {
  // プリフェッチ用のリンク(キャラクターPost一覧の最初のページ)
  const prefetchLink = `/tags/character/${character.nameKey}/page/1`;

  // TODO: Linkを使用するときに削除する
  function handleLinkClick() {
    if (typeof window !== 'undefined') {
      window.location.href = prefetchLink;
    }
  }

  return (
    <Flex direction="column" align="center" cursor="pointer" onClick={handleLinkClick}>
      {/* TODO: キャラクター分類が終わったらLinkを使用 */}
      {/* 未分類状態だと404にしたいが、本番環境だと出ない リダイレクトだと出るので一時的にそうしている */}
      {/* <Link href={prefetchLink}> */}

      {/* アイコン */}
      <Box mb={2}>
        <CharacterIcon character={character} iconSize="80px" priority />
      </Box>

      {/* キャラ名 */}
      <Text color="blackSwitch" fontSize="md" fontWeight="bold">
        {character.name}
      </Text>
      {/* </Link> */}
    </Flex>
  );
}
