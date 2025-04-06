/** キャラクターエンティティ */
export type CharacterEntity = {
  id: number;
  name: string;
  nameKey: string;
  iconFilename: string;
};

/** タグエンティティ */
export type TagEntity = {
  id: number;
  name: string;
};

/** 語録発言者エンティティ */
export type SpeakerEntity = {
  id: number;
  name: string;
  iconFilename: string;
  order: number;
};

/** 語録エンティティ */
export type PopularWordEntity = {
  id: number;
  word: string;
  kana: string;
};

/** 語録と発言者のまとまりエンティティ */
export type PopularWordSpeakerEntity = {
  speaker: SpeakerEntity;
  words: PopularWordEntity[];
};
