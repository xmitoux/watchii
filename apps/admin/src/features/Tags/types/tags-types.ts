import { CharacterEntity, PopularWordSpeakerEntity, TagEntity } from '@repo/ui/types';

/** タグ一覧ページコンポーネントのProps */
export type TagsProps = {
  characters: CharacterEntity[];
  tags: TagEntity[];
  popularWordSpeakers: PopularWordSpeakerEntity[];
};
