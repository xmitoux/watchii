-- CreateTable
CREATE TABLE "popular_words" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "kana" TEXT NOT NULL,
    "speaker_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "popular_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostPopularWords" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PostPopularWords_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "popular_words_word_key" ON "popular_words"("word");

-- CreateIndex
CREATE INDEX "_PostPopularWords_B_index" ON "_PostPopularWords"("B");

-- AddForeignKey
ALTER TABLE "popular_words" ADD CONSTRAINT "popular_words_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostPopularWords" ADD CONSTRAINT "_PostPopularWords_A_fkey" FOREIGN KEY ("A") REFERENCES "popular_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostPopularWords" ADD CONSTRAINT "_PostPopularWords_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
