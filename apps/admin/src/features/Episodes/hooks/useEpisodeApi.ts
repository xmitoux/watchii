import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { toaster } from '@repo/ui/chakra-ui/toaster';
import { PostEntity } from '@repo/ui/types';

import { EpisodeForm } from '../types';

type EpisodeEditData = {
  episodeTitle: string;
  posts: PostEntity[];
  thumbnailPostId: number;
};

type UseEpisodeApiOptions = {
  successMessage?: string;
};

export function useEpisodeApi(episodeId?: number, options: UseEpisodeApiOptions = {}) {
  // 編集時のデータ取得
  const {
    data: editData,
    error: fetchError,
    isLoading,
  } = useSWR<EpisodeEditData>(
    // episodeIdがある時だけフェッチする
    episodeId ? `/api/episodes/edit-data/${episodeId}` : null,
    (url: string) => fetch(url).then((res) => res.json()),
  );

  // 保存処理(新規作成 or 更新)
  const { trigger, isMutating } = useSWRMutation(
    episodeId ? `/api/episodes/update/${episodeId}` : '/api/episodes/create',
    async (url: string, { arg }: { arg: EpisodeForm }) => {
      const res = await fetch(url, {
        method: episodeId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      });

      if (!res.ok) {
        throw new Error('API error occurred');
      }

      return res.json();
    },
  );

  // 保存実行！
  const saveEpisode = async (data: EpisodeForm) => {
    try {
      await trigger(data);

      // 成功メッセージをカスタマイズ可能に！
      toaster.create({
        title: options.successMessage ?? 'エピソード保存完了！🎉',
        type: 'success',
      });

      return true;
    }
    catch {
      toaster.create({
        title: 'エラーが発生しました…🥲',
        type: 'error',
      });

      return false;
    }
  };

  return {
    editData,
    fetchError,
    isLoading,
    isSaving: isMutating,
    saveEpisode,
  };
}
