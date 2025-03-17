import Layout from '@/components/Layout/Layout';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';

import { PostGallery } from '../PostGallery/PostGallery';

import { EpisodeDetailProps } from './types';

export default function EpisodeDetail({ episodeTitle, posts }: EpisodeDetailProps) {
  const { scrollRef } = useLayoutScroll();

  useNavigationRestore('episodes', scrollRef);

  return (
    <Layout title={episodeTitle} canBack scrollRef={scrollRef}>
      {/* post一覧 */}
      <PostGallery posts={posts} />
    </Layout>
  );
}
