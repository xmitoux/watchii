/*
  Warnings:

  - Made the column `category` on table `episodes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "episodes" ALTER COLUMN "category" SET NOT NULL;
