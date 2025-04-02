export type CharacterEntity = {
  id: number;
  name: string;
  nameKey: string;
  iconFilename: string;
};

export type FindAllCharactersResponse = {
  characters: CharacterEntity[];
};

export type TagsProps = {
  characters: CharacterEntity[];
};
