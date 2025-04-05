import NextImage from 'next/image';

// import Link from 'next/link';
import { Box, Flex, Image, Text } from '@repo/ui/chakra-ui';
import { useNextImage } from '@repo/ui/hooks';

import { CharacterEntity } from '../types/tags-types';

type CharacterCardProps = {
  character: CharacterEntity;
};

/** キャラクタータグコンポーネント */
export function CharacterTag({ character }: CharacterCardProps) {
  const src = `chara-icons/${character.iconFilename}`;
  const width = 200;
  const { imageLoader, imageSrc } = useNextImage({ src, width });

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
      {/* TODO: キャラクター分類が終わったらLinkを使用  */}
      {/* 未分類状態だと404にしたいが、本番環境だと出ない リダイレクトだと出るので一時的にそうしている */}
      {/* <Link href={prefetchLink}> */}
      {/* アイコン */}
      <Box
        bg="hachiBlue"
        borderRadius="full"
        mb={2}
        p={1}
        transition="all 0.2s"
        _hover={{
          transform: 'scale(1.05)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Image asChild borderRadius="full" objectFit="cover" alt="">
          <NextImage
            src={imageSrc}
            loader={imageLoader}
            width={width}
            height={0}
            style={{ width: '80px', height: 'auto' }}
            priority
            alt={character.name}
          />
        </Image>
      </Box>

      {/* キャラ名 */}
      <Text color="blackSwitch" fontSize="md" fontWeight="bold">
        {character.name}
      </Text>
      {/* </Link> */}
    </Flex>
  );
}
