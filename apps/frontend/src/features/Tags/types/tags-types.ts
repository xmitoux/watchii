import { PostEntity } from '@/types/post-types';

export type CharacterEntity = {
  id: number;
  name: string;
  nameKey: string;
  iconFilename: string;
};

export type TagEntity = {
  id: number;
  name: string;
};

export type TagsProps = {
  characters: CharacterEntity[];
  tags: TagEntity[];
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

export type GetTagsPostCountEntity = {
  id: number;
  postCount: number;
};

export type TagPostsProps = {
  posts: PostEntity[];
  tagName: string;
  total: number;
  currentPage: number;
  perPage: number;
};
