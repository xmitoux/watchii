// custom loaderを使用するためのnext/iamgeのラッパーコンポーネント
import Image from 'next/image';
import { CSSProperties } from 'react';

export type ImageLoaderProps = {
  src: string;
  width: number;
};

function imageLoader({ src, width }: ImageLoaderProps) {
  return `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/w=${width},f=webp/${src}`;
}

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
  return (
    <Image
      style={{
        width: styleWidth,
        height: styleHeight,
        ...style,
      }}
      className={className}
      src={src}
      loader={imageLoader}
      width={width}
      height={height}
      alt={alt}
      priority={priority}
      onClick={() => onClick?.(src)}
    />
  );
}
