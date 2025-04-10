import NextImage from 'next/image';
import { useEffect, useState } from 'react';

import { Box } from '@repo/ui/chakra-ui';

export default function LoadingAnimation() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/images/loading-animation/loading1.png',
    '/images/loading-animation/loading2.png',
    '/images/loading-animation/loading3.png',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 250);

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
