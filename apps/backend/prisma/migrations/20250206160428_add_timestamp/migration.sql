/*
  Warnings:

  - Added the required column `updated_at` to the `episodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "episodes" 
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMP(3); -- 一旦デフォルト値なしで追加
-- デフォルト値を設定するために一度更新
UPDATE "episodes" SET "updated_at" = CURRENT_TIMESTAMP WHERE "updated_at" IS NULL;
-- 更新後にNOT NULL制約を追加
ALTER TABLE "episodes" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "posts" 
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMP(3); -- 一旦デフォルト値なしで追加

-- デフォルト値を設定するために一度更新
UPDATE "posts" SET "updated_at" = CURRENT_TIMESTAMP WHERE "updated_at" IS NULL;
-- 更新後にNOT NULL制約を追加
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET NOT NULL;
