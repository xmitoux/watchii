export type EpisodeItem = {
  id: number;
  title: string;
  thumbnailPost: { filename: string };
  totalPosts: number;
};

export type EpisodeFindAllResponse = {
  episodes: EpisodeItem[];
  total: number;
};

export type EpisodesProps = {
  episodes: EpisodeFindAllResponse['episodes'];
  total: number;
  currentPage: number;
  perPage: number;
  categoryPathName: string;
};
