import { CharacterPostsProps } from '@/features/Tags/types/tags-types';

import TagDetailBase from './TagDetailBase';

/** キャラクターPost一覧コンポーネント */
export default function CharacterPosts(props: CharacterPostsProps) {
  return (
    <TagDetailBase
      pageTitle={`${props.characterName}の漫画一覧`}
      paginationPath={`character/${props.characterNameKey}`}
      {...props}
    />
  );
}
