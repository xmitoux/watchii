import { PostEntity } from '@repo/ui/types';

/** Post一覧画面のProps */
export type PostsProps = {
  posts: PostEntity[];
  total: number;
  currentPage: number;
  perPage: number;
};

/** Post詳細画面のProps */
export type PostDetailProps = PostDetailEntity;

/** Post詳細 */
export type PostDetailEntity = {
  post: PostEntity & {
    tags: PostDetailTagEntity[];
    characters: PostDetailCharacterEntity[];
    popularWords: PostDetailPopularWordEntity[];
  };
};

/** Post詳細に紐づくキャラ */
export type PostDetailCharacterEntity = {
  id: number;
  name: string;
  iconFilename: string;
};

/** Post詳細に紐づくタグ */
export type PostDetailTagEntity = {
  id: number;
  name: string;
};

/** Post詳細に紐づく語録 */
export type PostDetailPopularWordEntity = {
  id: number;
  word: string;
};
