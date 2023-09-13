-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "account" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
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
    "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_account_user_agent_key" ON "Subscription"("account", "user_agent");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");
