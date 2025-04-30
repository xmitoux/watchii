import { Button, Icon } from '@repo/ui/chakra-ui';
import { IoHeart, IoHeartOutline } from '@repo/ui/icons';

import { usersApi } from '@/features/Signup/api/users-api';
import { useSessionToken } from '@/hooks/useSessionToken';
import { useUserFavs } from '@/hooks/useUserFavs';

type PostDetailFavButtonProps = {
  postId: number;
};

/** お気に入りボタン */
export default function PostDetailFavButton({ postId }: PostDetailFavButtonProps) {
  const { getSessionToken } = useSessionToken();
  const { favs, isFav, isFavLoading, mutate } = useUserFavs();

  // お気に入り状態
  const favorited = isFav(postId);

  // トグル処理
  const toggleFavorite = async () => {
    // 現在の状態を取得
    const currentFavorites = [...(favs || [])];

    // Optimistic UI更新！APIレスポンス待たずに先に画面更新
    if (isFav(postId)) {
      // 解除する場合：該当postIdを除外
      mutate(currentFavorites.filter((fav) => fav.postId !== postId), false);
    }
    else {
      // 追加する場合：新しいお気に入り追加
      mutate([...currentFavorites, { postId, favedAt: new Date() }], false);
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
