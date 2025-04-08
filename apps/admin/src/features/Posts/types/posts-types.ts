import { PostEntity } from '@repo/ui/types';

export type PostsProps = {
  posts: PostEntity[];
  total: number;
  currentPage: number;
  perPage: number;
};
