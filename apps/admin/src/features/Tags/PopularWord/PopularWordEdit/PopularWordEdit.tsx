import { useRouter } from 'next/router';
import React from 'react';

import Layout from '@/components/Layout/Layout';
import { tagsApi } from '@/features/Tags/api/tags-api';
import { UpdatePopularWordRequest } from '@/features/Tags/api/tags-api-types';
import { PopularWordForm } from '@/features/Tags/components/PopularWordForm';
import { PopularWordEditProps, PopularWordFormData } from '@/features/Tags/types/tags-types';
import { useToast } from '@/hooks/useToast';

/** 語録編集画面コンポーネント */
export default function PopularWordEdit({ popularWord, characters }: PopularWordEditProps) {
  const router = useRouter();
  const { showCompleteToast, showErrorToast } = useToast();

  const editData: PopularWordFormData = {
    word: popularWord.word,
    kana: popularWord.kana,
    speakerId: popularWord.speaker.id,
  };

  /** 更新処理 */
  async function handleUpdate(form: PopularWordFormData) {
    try {
      // 更新API実行
      const request: UpdatePopularWordRequest = { id: popularWord.id, form };
      await tagsApi.updatePopularWord(request);

      // 登録画面と違ってなぜかback後にトーストが出ないので、この画面ですぐ出す
      showCompleteToast('語録更新完了！📜', 100);
      router.back();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: '語録更新に失敗しました😢',
        errorMessage: error.message,
      });
    }
  }

  return (
    <Layout title="語録編集" canBack>
      <PopularWordForm characters={characters} editData={editData} onSubmit={handleUpdate} />
    </Layout>
  );
}
