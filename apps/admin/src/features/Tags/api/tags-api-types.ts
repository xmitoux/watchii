import { CharacterDetailEntity, CharacterFormData, PopularWordDetailEntity, PopularWordFormData, TagDetailEntity, TagFormData } from '../types/tags-types';

export type CreateTagRequest = TagFormData;
export type FindTagResponse = { tag: TagDetailEntity | null };
export type UpdateTagRequest = { id: number } & { form: TagFormData };

export type CreateCharacterRequest = CharacterFormData;
export type FindCharacterResponse = { character: CharacterDetailEntity | null };
export type UpdateCharacterRequest = { id: number } & { form: CharacterFormData };

export type CreatePopularWordRequest = PopularWordFormData;
export type FindPopularWordResponse = { popularWord: PopularWordDetailEntity | null };
export type UpdatePopularWordRequest = { id: number } & { form: PopularWordFormData };
