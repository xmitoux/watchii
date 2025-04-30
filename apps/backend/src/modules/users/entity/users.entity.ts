import { AuthResponse, Session } from '@supabase/supabase-js';

export type RegisterUserResponseEntity = { session: Session };

export type GetUserFavsResponseEntity = {
  postId: number;
  favedAt: Date;
};
