import { Episode, Post } from '@prisma/client';

type EpisodeEntity =
  Pick<Episode, 'id' | 'title'> &
  {
    thumbnailPost: Pick<Post, 'imageUrl'>;
    totalPosts: number;
  };

export class EpisodeFindAllResponseEntity {
  episodes: EpisodeEntity[];
  total: number;
}
