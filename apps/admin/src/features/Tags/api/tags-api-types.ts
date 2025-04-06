import { TagFormData } from '../types/tags-types';

export type CreateTagRequest = TagFormData;
export type UpdateTagRequest = { id: number } & { form: TagFormData };
