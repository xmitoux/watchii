-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "posted_at" TIMESTAMP(3) NOT NULL,
    "episode_id" INTEGER,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episodes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail_post_id" INTEGER NOT NULL,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_image_url_key" ON "posts"("image_url");

-- CreateIndex
CREATE UNIQUE INDEX "episodes_title_key" ON "episodes"("title");

-- CreateIndex
CREATE UNIQUE INDEX "episodes_thumbnail_post_id_key" ON "episodes"("thumbnail_post_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_thumbnail_post_id_fkey" FOREIGN KEY ("thumbnail_post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
