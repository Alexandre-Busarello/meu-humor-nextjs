-- CreateEnum para Status de Leads de Psicólogos
CREATE TYPE "PsychologistLeadStatus" AS ENUM ('NEW', 'CONTACTED', 'DEMO_SCHEDULED', 'DEMO_COMPLETED', 'PROPOSAL_SENT', 'CONVERTED', 'LOST');

-- CreateEnum para Fonte de Leads de Psicólogos
CREATE TYPE "PsychologistLeadSource" AS ENUM ('WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'OTHER');

-- CreateTable para Leads de Psicólogos
CREATE TABLE "psychologist_leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "crp" TEXT,
    "message" TEXT,
    "status" "PsychologistLeadStatus" NOT NULL DEFAULT 'NEW',
    "source" "PsychologistLeadSource" NOT NULL DEFAULT 'WEBSITE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "psychologist_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "psychologist_leads_status_created_at_idx" ON "psychologist_leads"("status", "created_at");

-- CreateIndex
CREATE INDEX "psychologist_leads_email_idx" ON "psychologist_leads"("email");

