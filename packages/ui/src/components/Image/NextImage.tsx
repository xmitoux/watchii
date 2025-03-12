import Image from 'next/image';
import { CSSProperties, useEffect, useRef, useState } from 'react';

import { Skeleton } from '@repo/ui/chakra-ui/skeleton';

const isProduction = process.env.NODE_ENV === 'production';
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL;
const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

// 固定のアスペクト比 (720:1024)
const FIXED_ASPECT_RATIO = 720 / 1024;

type ImageLoaderProps = {
  src: string;
  width: number;
};

const imageLoader = isProduction
  ? ({ src, width }: ImageLoaderProps) => {
    return `${CDN_BASE_URL}/w=${width},f=webp/${src}`;
  }
  : undefined;

export type NextImageProps = {
  src: string;
  width: number;
  height?: number;
  styleWidth: string;
  styleHeight?: string;
  alt: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
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
  style,
  onClick,
}: NextImageProps) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [skeletonHeight, setSkeletonHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 画像のURL
  const imageSrc = isProduction ? src : `${SUPABASE_STORAGE_URL}/${src}`;

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
    <div
      ref={containerRef}
      style={{
        width: styleWidth,
        height: styleHeight,
      }}
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
    </div>
  );
}
