import { PostEntity } from '@/types/post-types';

export type HomeProps = {
  posts: PostEntity[];
  total: number;
  currentPage: number;
  perPage: number;
};
