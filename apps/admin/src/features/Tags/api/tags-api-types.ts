import { CharacterDetailEntity, CharacterFormData, TagDetailEntity, TagFormData } from '../types/tags-types';

export type CreateCharacterRequest = CharacterFormData;

export type CreateTagRequest = TagFormData;
export type FindTagResponse = { tag: TagDetailEntity | null };
export type UpdateTagRequest = { id: number } & { form: TagFormData };

export type FindCharacterResponse = { character: CharacterDetailEntity | null };
export type UpdateCharacterRequest = { id: number } & { form: CharacterFormData };
