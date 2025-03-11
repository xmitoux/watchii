export type PostFindAllResponse = {
  posts: {
    id: number;
    filename: string;
  }[];
  total: number;
};

export type HomeProps = {
  posts: PostFindAllResponse['posts'];
  total: number;
  currentPage: number;
  perPage: number;
};
