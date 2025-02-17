/*
  Warnings:

  - Added the required column `transactionCursor` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "transactionCursor" TEXT NOT NULL;
