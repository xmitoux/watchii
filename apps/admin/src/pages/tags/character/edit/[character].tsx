import { GetServerSideProps } from 'next';

import { tagsApi } from '@/features/Tags/api/tags-api';
import CharacterEdit from '@/features/Tags/Character/CharacterEdit/CharacterEdit';
import { CharacterEditProps } from '@/features/Tags/types/tags-types';

export const getServerSideProps: GetServerSideProps<CharacterEditProps> = async ({ params }) => {
  const nameKey = params?.character as string;

  try {
    const { character } = await tagsApi.findCharacter(nameKey);
    if (!character) {
      return { notFound: true };
    }

    return {
      props: {
        character,
      },
    };
  }
  catch (error) {
    console.error('キャラクター編集ページ生成処理に失敗しました。', error);
    return { notFound: true };
  }
};

export default function CharacterEditPage(props: CharacterEditProps) {
  return <CharacterEdit {...props} />;
}
