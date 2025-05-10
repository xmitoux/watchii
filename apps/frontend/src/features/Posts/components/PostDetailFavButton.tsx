import { Icon } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { IoHeart, IoHeartOutline } from '@repo/ui/icons';

import { usersApi } from '@/features/Signup/api/users-api';
import { useSessionToken } from '@/hooks/useSessionToken';
import { useUserFavs } from '@/hooks/useUserFavs';
import { PostEntity } from '@/types/post-types';

type PostDetailFavButtonProps = {
  postId: number;
};

/** お気に入りボタン */
export default function PostDetailFavButton({ postId }: PostDetailFavButtonProps) {
  const { getSessionToken } = useSessionToken();
  const { favPosts, isFav, isFavLoading, mutate } = useUserFavs();

  // お気に入り状態
  const favorited = isFav(postId);

  // お気に入りトグル処理
  async function toggleFavorite() {
    try {
      const token = await getSessionToken();
      if (!token) {
        return;
      }

      // お気に入りトグルAPI(結果を待つ必要がないのでawaitしない)
      usersApi.toggleUserFavs({ postId }, token);

      // 現在のお気に入り一覧を取得
      const currentFavorites = [...favPosts];

      // 一覧の手動更新
      let mutateData: { posts: PostEntity[]; total: number };
      if (isFav(postId)) {
        // 解除する場合：該当postIdを除外
        const posts = currentFavorites.filter((post) => post.id !== postId);
        mutateData = { posts, total: posts.length };
      }
      else {
        // 追加する場合：新しいお気に入り追加
        const newFavPost: PostEntity = { id: postId, filename: '', postedAt: '' };
        // mutate({ posts: [newFavPost, ...currentFavorites], total: currentFavorites.length + 1 }, false);
        mutateData = { posts: [newFavPost, ...currentFavorites], total: currentFavorites.length + 1 };
      }

      // mutateオプション
      const mutateOptions = {
        // 手動更新の結果で楽観的更新(お気に入り一覧画面でリモートデータの更新を待たない)
        // https://swr.vercel.app/ja/docs/mutation#optimistic-updates
        optimisticData: mutateData,
        // 手動更新の結果を使うので再検証しない
        // https://swr.vercel.app/ja/docs/mutation#revalidation
        revalidate: false,
      };

      // mutateを実行(お気に入り一覧は楽観的更新の結果を使える)
      mutate(mutateData, mutateOptions);
    }
    catch (error) {
      console.error('Error:', error);
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
