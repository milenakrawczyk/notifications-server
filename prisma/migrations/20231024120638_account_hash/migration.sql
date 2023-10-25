-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "hash_id" TEXT;

-- Backfill hashed account id
UPDATE "Subscription" SET "hash_id" = encode(sha512(account::bytea), 'hex') WHERE "hash_id" IS NULL;

ALTER TABLE "Subscription" ALTER COLUMN "hash_id" SET NOT NULL;
