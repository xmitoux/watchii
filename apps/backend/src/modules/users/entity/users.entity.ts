import { Post } from '@prisma/client';
import { AuthResponse, Session } from '@supabase/supabase-js';

export type RegisterUserResponseEntity = { session: Session };

type PostEntity = Pick<
  Post,
  'id'
  | 'filename'
  | 'postedAt'
>;

export type GetUserFavsResponse = {
  posts: PostEntity[];
  total: number;
};

export type SignInWithOAuthResponseEntity = {
  userExists: boolean;
};
