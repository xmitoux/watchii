import { CharacterEntity, PopularWordEntity, PopularWordSpeakerEntity, TagEntity } from '../../types/tags-types';

export type FindAllCharactersResponse = {
  characters: CharacterEntity[];
};

export type FindAllTagsResponse = {
  tags: TagEntity[];
};

export type FindAllPopularWordsResponse = {
  popularWords: PopularWordEntity[];
};

export type FindAllPopularWordSpeakersResponse = {
  popularWordSpeakers: PopularWordSpeakerEntity[];
};
