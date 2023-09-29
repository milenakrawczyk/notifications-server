-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "account" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "push_subscription_object" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL,
    "block_height" INTEGER NOT NULL,
    "initiated_by" TEXT NOT NULL,
    "item_type" TEXT,
    "message" TEXT,
    "path" TEXT,
    "receiver" TEXT NOT NULL,
    "value_type" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id","endpoint")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_endpoint_key" ON "Subscription"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_push_subscription_object_key" ON "Subscription"("push_subscription_object");
