/*
  Warnings:

  - The `authorizedDate` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `date` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "authorizedDate",
ADD COLUMN     "authorizedDate" TIMESTAMP(3);
