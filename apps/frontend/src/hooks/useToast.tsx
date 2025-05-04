import { useCallback } from 'react';

import { toaster } from '@repo/ui/chakra-ui/toaster';

/** トースト用のカスタムフック */
export const useToast = () => {
  /** 完了トーストを表示する */
  const showCompleteToast = useCallback(
    (message: string, timeout: number = 500) => {
      setTimeout(() => {
        toaster.create({
          title: message,
          type: 'success',
          duration: 3000,
        });
      }, timeout);
    },
    [],
  );

  /** エラーメッセージトーストを表示する */
  const showErrorToast = useCallback(
    ({ message, errorMessage }: { message: string; errorMessage?: string }) => {
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
