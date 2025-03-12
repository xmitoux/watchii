import Layout from '@/components/Layout/Layout';

import { PostGallery } from '../PostGallery/PostGallery';

import { EpisodeDetailProps } from './types';

export default function EpisodeDetail({ episodeTitle, posts }: EpisodeDetailProps) {
  return (
    <Layout title={episodeTitle} canBack>
      {/* post一覧 */}
      <PostGallery posts={posts} />
    </Layout>
  );
}
