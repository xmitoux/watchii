import { CharacterEntity, PopularWordSpeakerEntity, TagEntity } from '../../types/tags-types';

export type FindAllCharactersResponse = {
  characters: CharacterEntity[];
};

export type FindAllTagsResponse = {
  tags: TagEntity[];
};

export type FindAllPopularWordsResponse = {
  popularWordSpeakers: PopularWordSpeakerEntity[];
};
