/*
  Warnings:

  - You are about to drop the column `price_in_cents` on the `leases` table. All the data in the column will be lost.
  - Added the required column `leasing_price_in_cents` to the `leases` table without a default value. This is not possible if the table is not empty.
  - Made the column `service_id` on table `leases` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "leases" DROP CONSTRAINT "leases_service_id_fkey";

-- AlterTable
ALTER TABLE "leases" DROP COLUMN "price_in_cents",
ADD COLUMN     "leasing_price_in_cents" INTEGER NOT NULL,
ALTER COLUMN "service_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
