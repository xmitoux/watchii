import NextImage from 'next/image';
import { useEffect, useState } from 'react';

import { Box } from '@repo/ui/chakra-ui';

export default function LoadingAnimation() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/loading-animations/loading1.png',
    '/loading-animations/loading2.png',
    '/loading-animations/loading3.png',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 500);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      h="80vh"
    >
      <NextImage
        src={images[currentImageIndex]}
        width={300}
        height={0}
        style={{
          width: '350px',
          height: 'auto',
        }}
        alt="loading"
        priority
      />
    </Box>
  );
}
