-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('GLOBAL', 'PARCIAL');

-- DropIndex
DROP INDEX "public"."health_records_user_id_created_at_idx";

-- AlterTable
ALTER TABLE "health_records" ADD COLUMN     "generation_month" TEXT,
ADD COLUMN     "mood_entry_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "record_type" "RecordType" NOT NULL DEFAULT 'PARCIAL';

-- CreateIndex
CREATE INDEX "health_records_user_id_record_type_created_at_idx" ON "health_records"("user_id", "record_type", "created_at");
