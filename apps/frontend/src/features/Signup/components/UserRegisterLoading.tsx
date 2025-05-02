import NextImage from 'next/image';
import { useEffect, useState } from 'react';

import { Box } from '@repo/ui/chakra-ui';

/** ユーザ登録確認中ローディング */
export default function UserRegisterLoading() {
  const images = [
    '',
    '/images/user-registration-loading/user-registration-loading_1.webp',
    '/images/user-registration-loading/user-registration-loading_2.webp',
    '/images/user-registration-loading/user-registration-loading_3.webp',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 500);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box h="210px">
      {images[currentImageIndex]
        ? (
          <NextImage
            src={images[currentImageIndex]}
            width={1000}
            height={0}
            style={{
              width: '350px',
              height: 'auto',
            }}
            alt="loading"
            priority
          />
        )
        : null}
    </Box>
  );
}
