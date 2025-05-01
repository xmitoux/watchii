import { Button, Icon } from '@repo/ui/chakra-ui';
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

  // トグル処理
  const toggleFavorite = async () => {
    // 現在の状態を取得
    const currentFavorites = [...favPosts];

    // Optimistic UI更新！APIレスポンス待たずに先に画面更新
    if (isFav(postId)) {
      // 解除する場合：該当postIdを除外
      const posts = currentFavorites.filter((post) => post.id !== postId);
      mutate({ posts, total: posts.length }, false);
    }
    else {
      // 追加する場合：新しいお気に入り追加
      const newFavPost: PostEntity = { id: postId, filename: '', postedAt: '' };
      mutate({ posts: [newFavPost, ...currentFavorites], total: currentFavorites.length + 1 }, false);
    }

    try {
      const token = await getSessionToken();
      if (!token) {
        return;
      }

      // お気に入りトグルAPI
      await usersApi.toggleUserFavs({ postId }, token);

      // キャッシュを更新して即時UI反映
      mutate();
    }
    catch (error) {
      console.error('Error:', error);
    }
  };

  const colorFav = { base: 'chiikawaPink', _dark: 'chiikawaPink.dark' };
  const colorNotFav = { base: 'chiiWhite', _dark: 'gray.900' };

  return (
    <Button
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
    </Button>
  );
}
