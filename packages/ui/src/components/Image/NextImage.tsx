import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import { CSSProperties, useEffect, useRef, useState } from 'react';

import { Skeleton } from '@repo/ui/chakra-ui/skeleton';

import { useNextImage } from '../../hooks/useNextImage';

// 固定のアスペクト比 (720:1024)
const FIXED_ASPECT_RATIO = 720 / 1024;

export type NextImageProps = {
  src: string;
  width: number;
  height?: number;
  styleWidth: string;
  styleHeight?: string;
  alt: string;
  priority?: boolean;
  className?: string;
  rounded?: boolean;
  onClick?: (src: string) => void;
};

export function NextImage({
  src,
  width,
  height = 0,
  styleWidth,
  styleHeight = 'auto',
  alt,
  priority = false,
  className = '',
  rounded = true,
  onClick,
}: NextImageProps) {
  const { imageLoader, imageSrc } = useNextImage({ src, width });

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [skeletonHeight, setSkeletonHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // コンテナの幅を監視して高さを計算
  useEffect(() => {
    // 初回レンダリング時に計算
    calculateHeight();

    // リサイズ時にも再計算
    const resizeObserver = new ResizeObserver(calculateHeight);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // 幅から高さを計算する関数
  const calculateHeight = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      // 720:1024のアスペクト比で高さを計算
      const calculatedHeight = containerWidth / FIXED_ASPECT_RATIO;
      setSkeletonHeight(calculatedHeight);
    }
  };

  return (
    <Box
      ref={containerRef}
      width={styleWidth}
      height={styleHeight}
    >
      {showSkeleton && (
        <Skeleton
          height={skeletonHeight > 0 ? `${skeletonHeight}px` : '200px'}
          width="100%"
          variant="shine"
        />
      )}
      <Image
        style={{
          width: styleWidth,
          height: styleHeight,
          display: showSkeleton ? 'none' : 'block',
          borderRadius: rounded ? '10px' : undefined,
        }}
        className={className}
        src={imageSrc}
        loader={imageLoader}
        width={width}
        height={height}
        alt={alt}
        priority={priority}
        onClick={() => onClick?.(imageSrc)}
        onLoad={() => setShowSkeleton(false)}
      />
    </Box>
  );
}
