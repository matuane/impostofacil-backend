/*
  Warnings:

  - You are about to drop the column `ticker_seller` on the `assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assets" DROP COLUMN "ticker_seller";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "ticker_seller" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "price_per_unit" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total_value" SET DATA TYPE DECIMAL(65,30);
