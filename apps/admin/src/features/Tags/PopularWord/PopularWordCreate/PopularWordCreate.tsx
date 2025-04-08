import { useRouter } from 'next/router';
import React from 'react';

import Layout from '@/components/Layout/Layout';
import { tagsApi } from '@/features/Tags/api/tags-api';
import { PopularWordForm } from '@/features/Tags/components/PopularWordForm';
import { PopularWordCreateProps, PopularWordFormData } from '@/features/Tags/types/tags-types';
import { useToast } from '@/hooks/useToast';

/** 語録登録画面コンポーネント */
export default function PopularWordCreate({ characters }: PopularWordCreateProps) {
  const router = useRouter();

  const { showCompleteToast, showErrorToast } = useToast();

  /** 登録処理 */
  async function handleCreate(form: PopularWordFormData) {
    try {
      // 登録API実行
      await tagsApi.createPopularWord(form);

      showCompleteToast('語録登録完了！📜');
      router.back();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: '語録登録に失敗しました😢',
        errorMessage: error.message,
      });
      console.error('語録登録に失敗しました。', error);
    }
  }

  return (
    <Layout title="語録登録" canBack>
      <PopularWordForm characters={characters} onSubmit={handleCreate} />
    </Layout>
  );
}
