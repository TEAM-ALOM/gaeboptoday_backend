/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu_imbed` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "menu" DROP CONSTRAINT "menu_dataId_fkey";

-- DropForeignKey
ALTER TABLE "menu_imbed" DROP CONSTRAINT "menu_imbed_menuId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "data";

-- DropTable
DROP TABLE "menu";

-- DropTable
DROP TABLE "menu_imbed";

-- CreateTable
CREATE TABLE "Menu" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Daily" (
    "id" TEXT NOT NULL,
    "weeklyId" TEXT NOT NULL,

    CONSTRAINT "Daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "menu_name" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Data" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weekly" (
    "id" TEXT NOT NULL,
    "dataId" TEXT,
    "day" "DoW" NOT NULL,

    CONSTRAINT "Weekly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_daily_lunch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_daily_dinner" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_name_key" ON "Menu"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Daily_id_key" ON "Daily"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_id_key" ON "Review"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Data_id_key" ON "Data"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Weekly_id_key" ON "Weekly"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_daily_lunch_AB_unique" ON "_daily_lunch"("A", "B");

-- CreateIndex
CREATE INDEX "_daily_lunch_B_index" ON "_daily_lunch"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_daily_dinner_AB_unique" ON "_daily_dinner"("A", "B");

-- CreateIndex
CREATE INDEX "_daily_dinner_B_index" ON "_daily_dinner"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Daily" ADD CONSTRAINT "Daily_weeklyId_fkey" FOREIGN KEY ("weeklyId") REFERENCES "Weekly"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_menu_name_fkey" FOREIGN KEY ("menu_name") REFERENCES "Menu"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weekly" ADD CONSTRAINT "Weekly_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_daily_lunch" ADD CONSTRAINT "_daily_lunch_A_fkey" FOREIGN KEY ("A") REFERENCES "Daily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_daily_lunch" ADD CONSTRAINT "_daily_lunch_B_fkey" FOREIGN KEY ("B") REFERENCES "Menu"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_daily_dinner" ADD CONSTRAINT "_daily_dinner_A_fkey" FOREIGN KEY ("A") REFERENCES "Daily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_daily_dinner" ADD CONSTRAINT "_daily_dinner_B_fkey" FOREIGN KEY ("B") REFERENCES "Menu"("name") ON DELETE CASCADE ON UPDATE CASCADE;
