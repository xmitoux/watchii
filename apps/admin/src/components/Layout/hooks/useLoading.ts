import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/** ローディング使用のためのカスタムフック */
export const useLoading = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // ページ遷移時のローディング状態を管理
  useEffect(() => {
    // ページ遷移開始時
    const handleStart = () => {
      setLoading(true);
    };

    // ページ遷移完了時
    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const [showLoading, setShowLoading] = useState(false);

  // ちらつき防止のため、少し遅延させてからローディングを表示
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => setShowLoading(true), 500);
    }
    else {
      setShowLoading(false);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  return {
    showLoading,
  };
};
