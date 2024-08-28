/*
  Warnings:

  - You are about to drop the `table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "table";

-- CreateTable
CREATE TABLE "route_data" (
    "id" SERIAL NOT NULL,
    "msg" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_data_pkey" PRIMARY KEY ("id")
);
