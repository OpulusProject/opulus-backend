/*
  Warnings:

  - A unique constraint covering the columns `[plaidId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plaidId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plaidId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plaidId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plaidUserToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_plaidId_key" ON "Account"("plaidId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_plaidId_key" ON "Item"("plaidId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_plaidId_key" ON "Transaction"("plaidId");

-- CreateIndex
CREATE UNIQUE INDEX "User_plaidId_key" ON "User"("plaidId");

-- CreateIndex
CREATE UNIQUE INDEX "User_plaidUserToken_key" ON "User"("plaidUserToken");
