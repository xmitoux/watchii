import NextImage from 'next/image';

import { Box, Image } from '@repo/ui/chakra-ui';
import { useNextImage } from '@repo/ui/hooks';

import { getCharacterColor } from '../utils/character-colors';

type CharacterIconProps = {
  character: {
    id: number;
    name: string;
    iconFilename: string;
  };
  size?: number;
  iconSize?: string;
  borderSize?: string | number;
  priority?: boolean;
};

/** キャラクターアイコンコンポーネント */
export function CharacterIcon({
  character,
  size = 120,
  iconSize = '50px',
  priority,
  borderSize = '3px',
}: CharacterIconProps) {
  const src = `chara-icons/${character.iconFilename}`;
  const { imageLoader, imageSrc } = useNextImage({ src, width: size });

  // キャラクターの名前から色を取得
  const borderColor = getCharacterColor(character.id);

  return (
    <Box
      bg={borderColor}
      borderRadius="full"
      p={borderSize}
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
          width={size}
          height={0}
          style={{ width: iconSize, height: 'auto' }}
          priority={priority}
          alt={character.name}
        />
      </Image>
    </Box>
  );
}
