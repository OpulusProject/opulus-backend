-- CreateTable
CREATE TABLE "LinkSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkSession_linkToken_key" ON "LinkSession"("linkToken");

-- AddForeignKey
ALTER TABLE "LinkSession" ADD CONSTRAINT "LinkSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
