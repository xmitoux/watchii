// custom loaderを使用するためのnext/iamgeのラッパーコンポーネント
import Image from 'next/image';
import { CSSProperties } from 'react';

const isProduction = process.env.NODE_ENV === 'production';
// CDNのベースURL(本番環境用)
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL;
// supabaseのストレージURL(開発環境用)
const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

type ImageLoaderProps = {
  src: string;
  width: number;
};

// custom loader(CDNによる画像最適化URLを返す)(本番環境のみ使用)
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
  // 画像のURL
  // (本番環境はファイル名をそのままloaderに渡しCDNのURLを作成、開発環境はsupabase URLを付与する)
  const imageSrc = isProduction ? src : `${SUPABASE_STORAGE_URL}/${src}`;

  return (
    <Image
      style={{
        width: styleWidth,
        height: styleHeight,
        ...style,
      }}
      className={className}
      src={imageSrc}
      loader={imageLoader}
      width={width}
      height={height}
      alt={alt}
      priority={priority}
      onClick={() => onClick?.(imageSrc)}
    />
  );
}
