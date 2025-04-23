import { TagPostsProps } from '@/features/Tags/types/tags-types';

import TagDetailBase from './TagDetailBase';

/** タグPost一覧コンポーネント */
export default function TagPosts(props: TagPostsProps) {
  return (
    <TagDetailBase
      pageTitle={props.tagName}
      paginationPath={`tag/${props.id}`}
      {...props}
    />
  );
}
