import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';

import { Box } from '@repo/ui/chakra-ui';
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

  const [showEffect, setShowEffect] = useState(false);
  const [clickPosition, setClickPosition] = useState<ClickPosition>({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  // お気に入りトグル処理中かどうか
  const isToggleProcessingRef = useRef<boolean>(false);
  // 保留中のトグル状態
  const pendingToggleStateRef = useRef<boolean | null>(null);

  // お気に入り状態
  const favorited = isFav(post.id);

  // エフェクトを実行する関数（視覚効果のみ）
  function showSparkleEffect(e: React.MouseEvent) {
    // クリック位置を取得
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (buttonRect) {
      // ボタン内のクリック位置を取得
      const x = e.clientX - buttonRect.left;
      const y = e.clientY - buttonRect.top;
      setClickPosition({ x, y });
    }

    // エフェクトを表示
    setShowEffect(true);
    // エフェクトの表示時間後に非表示にする
    setTimeout(() => {
      setShowEffect(false);
    }, 1200);
  }

  // お気に入りボタンのクリックイベントハンドラ
  function handleFav(e: React.MouseEvent) {
    // パーティクル処理
    if (!favorited) {
      // 今がお気に入りでない(=今からお気に入りにする)場合のみパーティクルを表示
      showSparkleEffect(e);
    }

    // 今からトグルする状態
    const newFavState = !favorited;

    // 楽観的UI更新
    updateFavOptimistically(newFavState);

    if (isToggleProcessingRef.current) {
      // すでに処理中ならキューイング
      pendingToggleStateRef.current = newFavState;
    }
    else {
      // 処理中じゃない場合はそのまま実行
      executeToggleApi(newFavState);
    }
  }

  // 楽観的UI更新（ボタンの表示状態をすぐに変更）
  function updateFavOptimistically(newFavState: boolean) {
    // 現在のお気に入り一覧を取得
    const currentFavorites = [...favPosts];

    // 新しいお気に入り状態を作成
    let updatedFavorites: PostEntity[];
    if (!newFavState) {
      // 解除する場合：該当postIdを除外
      updatedFavorites = currentFavorites.filter((favPost) => favPost.id !== post.id);
    }
    else {
      // 追加する場合：新しいお気に入り追加
      const newFavPost: PostEntity = { ...post };
      updatedFavorites = [newFavPost, ...currentFavorites];
    }

    // 楽観的UI更新のデータ
    const optimisticData: GetUserFavsResponse = {
      posts: updatedFavorites,
      total: updatedFavorites.length,
    };

    // 即時UI更新（APIは呼ばない）
    mutate(optimisticData, false);
  }

  // お気に入りトグル処理
  async function executeToggleApi(newFavState: boolean) {
    try {
      isToggleProcessingRef.current = true;

      const token = await getSessionToken();
      if (!token) {
        return;
      }

      // お気に入り状態に応じたAPI呼び出し
      if (newFavState) {
        // お気に入り追加API
        await usersApi.addUserFav({ postId: post.id }, token);
      }
      else {
        // お気に入り解除API
        await usersApi.removeUserFav({ postId: post.id }, token);
      }

      // API成功後にキャッシュを再検証（オプション）
      // mutate();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'お気に入りトグル処理に失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      // 保留中のトグルがあるか確認
      const pendingState = pendingToggleStateRef.current;

      // 状態をリセット
      isToggleProcessingRef.current = false;
      pendingToggleStateRef.current = null;

      if (pendingState !== null) {
        // 保留中のトグルがあれば実行
        // 少し遅延させて次の処理を実行（UIの反応性を向上）
        setTimeout(() => {
          executeToggleApi(pendingState);
        }, 50);
      }
    }
  }

  const colorFav = { base: 'chiikawaPink', _dark: 'chiikawaPink.dark' };
  const colorNotFav = { base: 'chiiWhite', _dark: 'gray.900' };

  return (
    // アニメーション要素とボタン要素を含む親要素
    <Box position="relative" display="inline-block" ref={buttonRef}>
      {/* キラキラエフェクト用のコンテナ - ボタンの外側に絶対位置で配置 */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        pointerEvents="none"
        zIndex="1"
        overflow="visible"
      >
        <AnimatePresence>
          {showEffect && (
            <>
              <ExplosionEffect x={clickPosition.x} y={clickPosition.y} />
              <SparkleEffect x={clickPosition.x} y={clickPosition.y} />
              <HeartPulse x={clickPosition.x} y={clickPosition.y} />
              <FloatingHeartsEffect x={clickPosition.x} y={clickPosition.y} />
            </>
          )}
        </AnimatePresence>
      </Box>

      {/* ボタン本体 - アニメーション要素の影響を受けない */}
      <BasicButton
        variant={favorited ? 'solid' : 'outline'}
        color={favorited ? 'chiiWhite' : colorFav}
        bg={favorited ? colorFav : colorNotFav}
        borderColor={colorFav}
        size="lg"
        w="200px"
        mb={4}
        position="relative"
        zIndex="0"
        disabled={isFavLoading}
        loading={isFavLoading}
        onClick={handleFav}
      >
        {favorited
          ? (
            <motion.div
              animate={{ scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <IoHeart />
            </motion.div>
          )
          : <IoHeartOutline />}
        <motion.span
          animate={favorited
            ? { scale: [1, 1.08, 1] }
            : {}}
          transition={{ duration: 0.4 }}
        >
          お気に入り
        </motion.span>
      </BasicButton>
    </Box>
  );
}

// SparkleParticleのprops型を定義
type SparkleParticleProps = {
  delay: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  color: string;
  shape: string;
};

// クリック位置情報の型
type ClickPosition = {
  x: number;
  y: number;
};

// パーティクル形状コンポーネント
const ParticleShape = ({ shape, color }: { shape: string; color: string }) => {
  switch (shape) {
    case 'star':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill={color} />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color} />
        </svg>
      );
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill={color} />
        </svg>
      );
    case 'sparkle':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" fill={color} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" fill={color} />
        </svg>
      );
  }
};

// クリック位置を中心にしたキラキラパーティクル
const PositionedSparkleParticle = ({ delay, x, y, size, duration, color, shape, originX, originY }: SparkleParticleProps & { originX: number; originY: number }) => (
  <motion.div
    style={{
      position: 'absolute',
      top: originY,
      left: originX,
      width: size,
      height: size,
      zIndex: 1,
      pointerEvents: 'none',
    }}
    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x,
      y,
      rotate: [0, 360],
    }}
    transition={{
      duration,
      delay,
      ease: 'easeOut',
    }}
  >
    <ParticleShape shape={shape} color={color} />
  </motion.div>
);

// ハートの波紋エフェクト
const HeartPulse = ({ x, y }: { x: number; y: number }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0.7, scale: 1 }}
        animate={{ opacity: 0, scale: 2 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          border: '2px solid',
          borderColor: '#FF6B8B',
          borderRadius: '50%',
          top: y - 20,
          left: x - 20,
          width: '40px',
          height: '40px',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ opacity: 0.5, scale: 1 }}
        animate={{ opacity: 0, scale: 1.7 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          border: '2px solid',
          borderColor: '#FF96AB',
          borderRadius: '50%',
          top: y - 20,
          left: x - 20,
          width: '40px',
          height: '40px',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

// 複数の小さなハートが浮き上がるエフェクト
const FloatingHeartsEffect = ({ x, y }: { x: number; y: number }) => {
  const hearts = [];
  for (let i = 0; i < 5; i++) {
    const xOffset = (Math.random() - 0.5) * 60;
    hearts.push(
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          top: y - 10,
          left: x + xOffset,
          color: '#FF6B8B',
          fontSize: Math.random() * 10 + 14 + 'px',
          zIndex: 10,
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [0, -40 - Math.random() * 40],
          x: xOffset + (Math.random() - 0.5) * 20,
        }}
        transition={{ duration: 1 + Math.random() * 0.5, delay: Math.random() * 0.3 }}
      >
        ♥
      </motion.div>,
    );
  }
  return <>{hearts}</>;
};

// パーティクルの爆発エフェクト
const ExplosionEffect = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    style={{
      position: 'absolute',
      top: y,
      left: x,
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 214, 255, 0.3)',
      transform: 'translate(-50%, -50%)',
      zIndex: 0,
      pointerEvents: 'none',
    }}
    initial={{ scale: 0, opacity: 0.6 }}
    animate={{ scale: 1.5, opacity: 0 }}
    transition={{ duration: 0.5 }}
  />
);

// キラキラエフェクト生成
const SparkleEffect = ({ x, y }: { x: number; y: number }) => {
  // 多彩なパーティクルを生成
  const particles = [];
  // 春めいたパステルカラー
  const colors = ['#FFD700', '#FF6B8B', '#FFC0CB', '#FF69B4', '#FFFACD', '#87CEFA', '#98FB98', '#DDA0DD'];
  // パーティクルの形状バリエーション
  const shapes = ['star', 'heart', 'circle', 'sparkle'];

  // 外側に飛び散るパーティクル
  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * Math.PI * 2;
    const distance = Math.random() * 80 + 30;
    particles.push(
      <PositionedSparkleParticle
        key={`outer-${i}`}
        delay={Math.random() * 0.2}
        x={Math.cos(angle) * distance}
        y={Math.sin(angle) * distance}
        size={Math.random() * 14 + 8}
        duration={Math.random() * 0.6 + 0.8}
        color={colors[Math.floor(Math.random() * colors.length)]}
        shape={shapes[Math.floor(Math.random() * shapes.length)]}
        originX={x}
        originY={y}
      />,
    );
  }

  // 内側でキラキラするパーティクル
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const distance = Math.random() * 30 + 10;
    particles.push(
      <PositionedSparkleParticle
        key={`inner-${i}`}
        delay={Math.random() * 0.3}
        x={Math.cos(angle) * distance}
        y={Math.sin(angle) * distance}
        size={Math.random() * 12 + 6}
        duration={Math.random() * 0.8 + 0.5}
        color={colors[Math.floor(Math.random() * colors.length)]}
        shape={shapes[Math.floor(Math.random() * shapes.length)]}
        originX={x}
        originY={y}
      />,
    );
  }

  return <>{particles}</>;
};
