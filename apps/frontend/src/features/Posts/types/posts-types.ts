import { PopularWordSpeakerEntity, PostEntity } from '@repo/ui/types';

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
    popularWords: PopularWordSpeakerEntity[];
  };
};

/** Post詳細に紐づくキャラ */
export type PostDetailCharacterEntity = {
  id: number;
  name: string;
  nameKey: string;
  iconFilename: string;
};

/** Post詳細に紐づくタグ */
export type PostDetailTagEntity = {
  id: number;
  name: string;
};
