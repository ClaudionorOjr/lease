/*
  Warnings:

  - You are about to drop the `schedulings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "schedulings" DROP CONSTRAINT "schedulings_created_by_fkey";

-- DropForeignKey
ALTER TABLE "schedulings" DROP CONSTRAINT "schedulings_service_id_fkey";

-- DropForeignKey
ALTER TABLE "schedulings" DROP CONSTRAINT "schedulings_solicitation_id_fkey";

-- DropTable
DROP TABLE "schedulings";

-- CreateTable
CREATE TABLE "leases" (
    "id" TEXT NOT NULL,
    "lessee" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "price_in_cents" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "solicitation_id" TEXT,
    "service_id" TEXT,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "leases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leases_start_date_end_date_idx" ON "leases"("start_date", "end_date");

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_solicitation_id_fkey" FOREIGN KEY ("solicitation_id") REFERENCES "solicitations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
