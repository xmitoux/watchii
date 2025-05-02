/*
  Warnings:

  - The primary key for the `user_favs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `favedAt` on the `user_favs` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `user_favs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_favs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `users` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `user_favs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_favs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_favs" DROP CONSTRAINT "user_favs_postId_fkey";

-- DropForeignKey
ALTER TABLE "user_favs" DROP CONSTRAINT "user_favs_userId_fkey";

-- AlterTable
ALTER TABLE "user_favs" DROP CONSTRAINT "user_favs_pkey",
DROP COLUMN "favedAt",
DROP COLUMN "postId",
DROP COLUMN "userId",
ADD COLUMN     "faved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "post_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "user_favs_pkey" PRIMARY KEY ("user_id", "post_id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userType",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_type" INTEGER NOT NULL DEFAULT 2;

-- AddForeignKey
ALTER TABLE "user_favs" ADD CONSTRAINT "user_favs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favs" ADD CONSTRAINT "user_favs_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
