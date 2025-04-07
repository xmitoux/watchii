import { Character, Post } from '@prisma/client';

type FindAllCharactersEntity = Pick<
  Character,
  'id'
  | 'name'
  | 'nameKey'
  | 'iconFilename'
>;

export class FindAllCharactersResponse {
  characters: FindAllCharactersEntity[];
}

type GetCharactersPostCountEntity = Pick<Character, 'nameKey'> & { postCount: number };
export type GetCharactersPostCountResponse = GetCharactersPostCountEntity[];

type PostEntity = Pick<
  Post,
  'id'
  | 'filename'
  | 'postedAt'
>;

export type FindPostsByCharacterResponse = {
  characterName: string;
  posts: PostEntity[];
  total: number;
};

type FindCharacterEntity = Pick<
  Character,
  'id' |
  'name' |
  'nameKey' |
  'order'
>;

export type FindCharacterResponse = {
  character: FindCharacterEntity | null;
};
