-- CreateTable
CREATE TABLE "Preference" (
    "id" SERIAL NOT NULL,
    "account" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "dapp" TEXT NOT NULL,
    "block" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);
