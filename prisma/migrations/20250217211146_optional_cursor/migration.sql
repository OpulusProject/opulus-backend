-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_itemId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "transactionCursor" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("plaidId") ON DELETE RESTRICT ON UPDATE CASCADE;
