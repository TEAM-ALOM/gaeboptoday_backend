-- DropForeignKey
ALTER TABLE "menu" DROP CONSTRAINT "menu_dataId_fkey";

-- DropForeignKey
ALTER TABLE "menu_imbed" DROP CONSTRAINT "menu_imbed_menuId_fkey";

-- AlterTable
ALTER TABLE "menu" ALTER COLUMN "dataId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_imbed" ADD CONSTRAINT "menu_imbed_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
