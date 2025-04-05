import { GetStaticPaths, GetStaticProps } from 'next';

import { PAGENATION_CONSTS } from '@/constants/pagenation-consts';
import { tagsApi } from '@/features/Tags/api/tags-api';
import CharacterPosts from '@/features/Tags/CharacterPosts/CharacterPosts';
import { CharacterPostsProps } from '@/features/Tags/types/tags-types';

const PER_PAGE = PAGENATION_CONSTS.PER_PAGE;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];

  const charactersPostCount = await tagsApi.getCharactersPostCount();

  for (const character of charactersPostCount) {
    const { nameKey, postCount } = character;

    // 必要なページ数を計算（切り上げ）
    const pages = Math.ceil(postCount / PER_PAGE);

    // 各ページのパスパラメータを生成
    for (let i = 1; i <= pages; i++) {
      paths.push({
        params: {
          character: nameKey,
          page: String(i),
        },
      });
    }
  }

  // パス情報と fallback 設定を返す
  return {
    paths,
    fallback: false, // パスにないページは404を返す
  };
};

export const getStaticProps: GetStaticProps<CharacterPostsProps> = async ({ params }) => {
  // URLパラメータからカテゴリ名とページ番号を取得
  const characterNameKey = String(params?.character);
  const page = Number(params?.page) || 1;

  // オフセット計算（何件目から取得するか）
  const offset = (page - 1) * PER_PAGE;

  try {
    // 当該キャラクターのPost一覧をAPIから取得
    const data = await tagsApi.findPostsByCharacter({
      nameKey: characterNameKey,
      perPage: PER_PAGE,
      offset,
    });

    // ページコンポーネントに渡すpropsを返す
    return {
      props: {
        posts: data.posts,
        total: data.total,
        characterNameKey,
        characterName: data.characterName,
        currentPage: page,
        perPage: PER_PAGE,
      },
    };
  }
  catch (error) {
    console.error(`キャラクター(${characterNameKey})Post一覧ページのデータ取得中にエラーが発生しました。`, error);

    // エラーが発生した場合は404ページを表示
    return {
      notFound: true,
    };
  }
};

export default function CharacterPostsPage(props: CharacterPostsProps) {
  return <CharacterPosts {...props} />;
}
