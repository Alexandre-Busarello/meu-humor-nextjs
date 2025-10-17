-- CreateTable
CREATE TABLE "generation_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "record_type" "RecordType" NOT NULL DEFAULT 'PARCIAL',
    "generation_month" TEXT NOT NULL,
    "health_record_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "generation_logs_user_id_generation_month_idx" ON "generation_logs"("user_id", "generation_month");

-- AddForeignKey
ALTER TABLE "generation_logs" ADD CONSTRAINT "generation_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
