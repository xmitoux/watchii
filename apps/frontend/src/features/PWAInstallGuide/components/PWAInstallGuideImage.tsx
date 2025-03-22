import NextImage from 'next/image';

import { Image } from '@repo/ui/chakra-ui';
import { Box } from '@repo/ui/chakra-ui';

type PWAInstallGuideImageProps = {
  src: string;
  alt: string;
};

export function PWAInstallGuideImage({ src, alt }: PWAInstallGuideImageProps) {
  return (

    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      maxW="sm"
      boxShadow="md"
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image w="full" asChild>
        <NextImage
          src={src}
          width={400}
          height={400}
          style={{
            width: '300px',
            height: 'auto',
          }}
          alt={alt}
          priority
        />
      </Image>
    </Box>
  );
}
