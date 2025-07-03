-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "monthlyTaxId" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_monthlyTaxId_fkey" FOREIGN KEY ("monthlyTaxId") REFERENCES "monthly_taxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
