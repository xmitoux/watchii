const isProduction = process.env.NODE_ENV === 'production';
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL;
const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

type ImageLoaderProps = {
  src: string;
  width: number;
  format?: string;
};

// 本番環境用の画像ローダー
// (CDNを使用して画像を取得するためのURLを生成)
// (こうすることでvercelでNextImageを使っても課金されない)
function productionImageLoader({ src, width, format = 'webp' }: ImageLoaderProps) {
  return `${CDN_BASE_URL}/w=${width},f=${format}/${src}`;
}

type NextImageProps = ImageLoaderProps;

/** NextImageを使うためのカスタムフック(実行環境に応じたloaderとsrcを返す) */
export function useNextImage({ src, width, format }: NextImageProps) {
  const imageLoader = isProduction
    // 本番環境用の画像ローダー
    ? () => productionImageLoader({ src, width, format })
    // 開発環境ではローダーを使用せずSupabase Storeageの画像を直接取得
    : undefined;

  const imageSrc = isProduction ? src : `${SUPABASE_STORAGE_URL}/${src}`;

  return {
    imageLoader,
    imageSrc,
  };
}
