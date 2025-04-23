import { PopularWordPostsProps } from '@/features/Tags/types/tags-types';

import TagDetailBase from './TagDetailBase';

/** 語録Post一覧コンポーネント */
export default function PopularWordsPosts(props: PopularWordPostsProps) {
  return (
    <TagDetailBase
      pageTitle={props.word}
      paginationPath={`popular-word/${props.id}`}
      {...props}
    />
  );
}
