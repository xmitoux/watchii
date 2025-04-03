import { PostEntity } from '@/types/post-types';

import { CharacterEntity, GetCharactersPostCountEntity } from '../types/tags-types';

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
