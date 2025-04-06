import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { toaster } from '@repo/ui/chakra-ui/toaster';

/** トースト用のカスタムフック */
export const useToast = () => {
  const router = useRouter();

  /** 遷移と同時にトーストを表示する */
  const showCompleteToast = useCallback(
    ({ message, path }: { message: string; path: string }) => {
      // まずトーストをセットアップ
      setTimeout(() => {
        toaster.create({
          title: message,
          type: 'success',
          duration: 3000,
        });
      }, 500);

      // 画面遷移
      router.push(path);
    },
    [router],
  );

  /** エラーメッセージトーストを表示する */
  const showErrorToast = useCallback(
    ({ message, errorMessage }: { message: string; errorMessage: string }) => {
      setTimeout(() => {
        toaster.create({
          title: message,
          description: errorMessage || 'もう一度試してみてね',
          type: 'error',
          duration: 3000,
        });
      }, 500);
    },
    [],
  );

  return { showCompleteToast, showErrorToast };
};
