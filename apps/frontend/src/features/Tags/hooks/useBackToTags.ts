import { useRouter } from 'next/router';

/** タグ一覧に戻る処理のカスタムフック */
export const useBackToTags = () => {
  const router = useRouter();

  /** ヘッダーの戻るボタン処理 */
  function backToTags() {
    // タグ一覧に戻る
    router.push('/tags');
  }

  return { backToTags };
};
