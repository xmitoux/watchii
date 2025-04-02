import { Character } from '@prisma/client';

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
