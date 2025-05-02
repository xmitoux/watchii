export type RegisterUserRequestDto = {
  token: string;
  email: string;
};

export type ToggleUserFavsRequestDto = {
  postId: number;
};
