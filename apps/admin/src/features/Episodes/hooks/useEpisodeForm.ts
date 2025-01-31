import { useState } from 'react';

import { PostEntity } from '@repo/ui/types';

import { EpisodeForm } from '../types';

export function useEpisodeForm() {
  const [title, setTitle] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<PostEntity[]>([]);
  const [selectedThumbnailPostId, setSelectedThumbnailPostId] = useState<number | null>(null);

  /** エピソードPost選択処理 */
  function handleSelectPosts(posts: PostEntity[]) {
    setSelectedPosts(posts);

    if (selectedThumbnailPostId && posts.every(p => p.id !== selectedThumbnailPostId)) {
      // エピソードPost選択解除された画像がサムネイル設定選択されていた場合はその選択状態も解除
      setSelectedThumbnailPostId(null);
    }
  }

  /** 選択中のエピソードPostを削除 */
  function removeSelectedPost(postId: number, e: React.MouseEvent<HTMLButtonElement>) {
    setSelectedPosts(prevPosts => prevPosts.filter(p => p.id !== postId));

    if (postId === selectedThumbnailPostId) {
      // 削除された画像がサムネイル設定選択されていた場合はその選択状態も解除
      setSelectedThumbnailPostId(null);
    }

    e.stopPropagation();
  }

  /** プレビュー画像クリック処理 */
  function handlePreviewClick(postId: number) {
    // サムネイル設定選択状態をトグル
    setSelectedThumbnailPostId(prevId => prevId === postId ? null : postId);
  }

  /** フォームバリデーション */
  const isValid = Boolean(
    title.trim()
    && selectedPosts.length > 0
    && selectedThumbnailPostId !== null,
  );

  /** フォームをリセットする */
  function reset() {
    setTitle('');
    setSelectedPosts([]);
    setSelectedThumbnailPostId(null);
  }

  /** フォームの現在の値を取得(APIリクエスト時に便利) */
  function getFormData(): EpisodeForm {
    return {
      title,
      postIds: selectedPosts.map(post => post.id),
      thumbnailPostId: selectedThumbnailPostId!,
    };
  }

  return {
    episodeTitle: title,
    setEpisodeTitle: setTitle,
    selectedPosts,
    setSelectedPosts,
    selectedThumbnailPostId,
    setSelectedThumbnailPostId,
    handleSelectPosts,
    removeSelectedPost,
    handlePreviewClick,
    isValid,
    reset,
    getFormData,
  };
}
