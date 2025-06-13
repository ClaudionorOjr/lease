/*
  Warnings:

  - You are about to drop the column `lessor` on the `schedulings` table. All the data in the column will be lost.
  - You are about to drop the column `lessor` on the `solicitations` table. All the data in the column will be lost.
  - Added the required column `lessee` to the `schedulings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessee` to the `solicitations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedulings" DROP COLUMN "lessor",
ADD COLUMN     "lessee" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "solicitations" DROP COLUMN "lessor",
ADD COLUMN     "lessee" TEXT NOT NULL;
