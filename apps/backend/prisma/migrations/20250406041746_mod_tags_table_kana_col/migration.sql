-- AlterTable
ALTER TABLE "tags" DROP COLUMN "order";

-- AlterTable: NULLを許可して列を追加
ALTER TABLE "tags" ADD COLUMN "kana" TEXT;

-- 既存データに対してkanaの値を設定（空文字をデフォルト値として使用）
UPDATE "tags" SET "kana" = '';

-- NOT NULL制約を追加
ALTER TABLE "tags" ALTER COLUMN "kana" SET NOT NULL;
