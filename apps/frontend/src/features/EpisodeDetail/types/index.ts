import { SimplePost } from '@repo/ui/types';

export type EpisodeFindOneResponse = {
  episodeTitle: string;
  posts: SimplePost[];
};

export type EpisodeDetailProps = EpisodeFindOneResponse;
