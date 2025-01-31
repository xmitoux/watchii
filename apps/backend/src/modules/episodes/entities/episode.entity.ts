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

export class EpisodeFindOneResponseEntity {
  episodeTitle: string;
  posts: Pick<
    Post,
    'id'
    | 'imageUrl'
  >[];

  total: number;
}

export class EpisodeFindEditDataResponseEntity {
  episodeTitle: string;
  posts: Pick<
    Post,
    'id'
    | 'imageUrl'
  >[];

  thumbnailPostId: number;
}
