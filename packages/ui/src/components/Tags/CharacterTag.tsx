import Link from 'next/link';

import { Box, Flex, Text } from '@repo/ui/chakra-ui';
import { CharacterIcon } from '@repo/ui/components';
import { CharacterEntity } from '@repo/ui/types';

type CharacterTagProps = {
  character: CharacterEntity;
  to: string;
};

/** キャラクタータグコンポーネント */
export function CharacterTag({ character, to }: CharacterTagProps) {
  // プリフェッチ用のリンク
  const prefetchLink = to;

  return (
    <Link href={prefetchLink}>
      <Flex direction="column" align="center" cursor="pointer">

        {/* アイコン */}
        <Box mb={2}>
          <CharacterIcon character={character} iconSize="80px" priority />
        </Box>

        {/* キャラ名 */}
        <Text color="blackSwitch" fontSize="sm" fontWeight="bold" textAlign="center" w="100px">
          {character.name}
        </Text>
      </Flex>
    </Link>
  );
}
