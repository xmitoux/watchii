import { TagDetailEntity, TagFormData } from '../types/tags-types';

export type CreateTagRequest = TagFormData;
export type FindTagResponse = { tag: TagDetailEntity | null };
export type UpdateTagRequest = { id: number } & { form: TagFormData };
