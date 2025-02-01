-- AlterTable
ALTER TABLE "posts" RENAME COLUMN "image_url" TO "filename";

-- RenameIndex
ALTER INDEX "posts_image_url_key" RENAME TO "posts_filename_key";
