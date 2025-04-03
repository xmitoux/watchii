import { PostEntity } from '@/types/post-types';

export type CharacterEntity = {
  id: number;
  name: string;
  nameKey: string;
  iconFilename: string;
};

export type TagsProps = {
  characters: CharacterEntity[];
};

export type GetCharactersPostCountEntity = {
  nameKey: string;
  postCount: number;
};

export type CharacterPostsProps = {
  posts: PostEntity[];
  characterNameKey: string;
  characterName: string;
  total: number;
  currentPage: number;
  perPage: number;
};
