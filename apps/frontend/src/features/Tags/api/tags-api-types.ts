import { PostEntity } from '@/types/post-types';

import { CharacterEntity, GetCharactersPostCountEntity, GetTagsPostCountEntity, TagEntity } from '../types/tags-types';

export type FindAllCharactersResponse = {
  characters: CharacterEntity[];
};
export type GetCharactersPostCountResponse = GetCharactersPostCountEntity[];

export type FindPostsByCharacterRequest = {
  nameKey: string;
  perPage: number;
  offset: number;
};

export type FindPostsByCharacterResponse = {
  characterName: string;
  posts: PostEntity[];
  total: number;
};

export type FindAllTagsResponse = {
  tags: TagEntity[];
};
export type GetTagsPostCountResponse = GetTagsPostCountEntity[];

export type FindPostsByTagRequest = {
  id: number;
  perPage: number;
  offset: number;
};

export type FindPostsByTagResponse = {
  tagName: string;
  posts: PostEntity[];
  total: number;
};
