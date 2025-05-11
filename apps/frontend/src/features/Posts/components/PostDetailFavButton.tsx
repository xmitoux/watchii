import { Icon } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { IoHeart, IoHeartOutline } from '@repo/ui/icons';

import { usersApi } from '@/features/Signup/api/users-api';
import { GetUserFavsResponse } from '@/features/Signup/api/users-api-types';
import { useSessionToken } from '@/hooks/useSessionToken';
import { useToast } from '@/hooks/useToast';
import { useUserFavs } from '@/hooks/useUserFavs';
import { PostEntity } from '@/types/post-types';

type PostDetailFavButtonProps = {
  post: PostEntity;
};

/** お気に入りボタン */
export default function PostDetailFavButton({ post }: PostDetailFavButtonProps) {
  const { getSessionToken } = useSessionToken();
  const { favPosts, isFav, isFavLoading, mutate } = useUserFavs();
  const { showErrorToast } = useToast();

  // お気に入り状態
  const favorited = isFav(post.id);

  // お気に入りトグル処理
  async function toggleFavorite() {
    try {
      const token = await getSessionToken();
      if (!token) {
        return;
      }

      // 現在のお気に入り一覧を取得
      const currentFavorites = [...favPosts];

      // 新しいお気に入り状態の作成
      let updatedFavorites: PostEntity[];
      if (favorited) {
        // 解除する場合：該当postIdを除外
        updatedFavorites = currentFavorites.filter((favPost) => favPost.id !== post.id);
      }
      else {
        // 追加する場合：新しいお気に入り追加
        const newFavPost: PostEntity = { ...post };
        updatedFavorites = [newFavPost, ...currentFavorites];
      }

      // 楽観的UI更新の準備
      const optimisticData: GetUserFavsResponse = {
        posts: updatedFavorites,
        total: updatedFavorites.length,
      };

      // APIリクエスト実行 + 楽観的UI更新
      mutate(
        async () => {
          try {
            // お気に入りトグルAPI
            await usersApi.toggleUserFavs({ postId: post.id }, token);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          catch (error: any) {
            showErrorToast({
              message: 'お気に入りトグル処理に失敗しました😢',
              errorMessage: error.message,
            });
          }

          // API呼び出しが成功したらoptimisticDataを返して確定させる
          // APIレスポンスがある場合はそちらを優先して返せる
          return optimisticData;
        },
        {
          // リクエスト前に即座に表示するデータ
          optimisticData,
          // APIレスポンスでキャッシュを更新
          populateCache: true,
          // その後の再検証は不要 (APIからのレスポンスで既に最新状態になっている)
          revalidate: false,
          // エラー時にロールバック
          rollbackOnError: true,
        },
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'お気に入りトグル処理に失敗しました😢',
        errorMessage: error.message,
      });
    }
  }

  const colorFav = { base: 'chiikawaPink', _dark: 'chiikawaPink.dark' };
  const colorNotFav = { base: 'chiiWhite', _dark: 'gray.900' };

  return (
    <BasicButton
      variant={favorited ? 'solid' : 'outline'}
      color={favorited ? 'chiiWhite' : colorFav}
      bg={favorited ? colorFav : colorNotFav}
      borderColor={colorFav}
      size="lg"
      w="200px"
      mb={4}
      disabled={isFavLoading}
      loading={isFavLoading}
      onClick={toggleFavorite}
    >
      <Icon>
        {favorited ? <IoHeart /> : <IoHeartOutline />}
      </Icon>
      {favorited ? 'お気に入りを解除' : 'お気に入りに追加'}
    </BasicButton>
  );
}
