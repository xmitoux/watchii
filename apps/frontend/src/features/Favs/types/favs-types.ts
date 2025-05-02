import { PostEntity } from '@/types/post-types';

export type FavsProps = {
  posts: PostEntity[];
  total: number;
  currentPage: number;
  perPage: number;
};
