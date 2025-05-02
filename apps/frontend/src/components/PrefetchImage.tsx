import NextImage from 'next/image';

type PrefetchImageProps = {
  src: string;
  width: number;
};

/** 画像をプリフェッチするための非表示コンポーネント */
export default function PrefetchImage({ src, width }: PrefetchImageProps) {
  return (
    <NextImage
      src={src}
      width={width}
      height={0}
      style={{ display: 'none' }}
      priority
      alt=""
    />
  );
}
