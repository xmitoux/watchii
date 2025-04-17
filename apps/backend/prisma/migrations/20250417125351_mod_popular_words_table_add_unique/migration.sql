/*
  Warnings:

  - A unique constraint covering the columns `[word,speaker_id]` on the table `popular_words` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "popular_words_word_speaker_id_key" ON "popular_words"("word", "speaker_id");
