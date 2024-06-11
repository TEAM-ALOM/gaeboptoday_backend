/*
  Warnings:

  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `menu_name` on the `Review` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rate` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rateId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `day` on the `Weekly` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Daily" DROP CONSTRAINT "Daily_weeklyId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_menu_name_fkey";

-- DropForeignKey
ALTER TABLE "Weekly" DROP CONSTRAINT "Weekly_dataId_fkey";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "Daily" ALTER COLUMN "weeklyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Data" ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "menu_name",
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rateId" TEXT NOT NULL,
ADD COLUMN     "writer_id" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Review_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "studentCode" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("studentCode");

-- AlterTable
ALTER TABLE "Weekly" DROP COLUMN "day",
ADD COLUMN     "day" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "DoW";

-- CreateTable
CREATE TABLE "Image" (
    "urlPath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "menu_name" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("urlPath")
);

-- CreateTable
CREATE TABLE "MenuReview" (
    "id" TEXT NOT NULL,
    "menu_name" TEXT NOT NULL,
    "review_id" TEXT,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "MenuReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Star" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "menu_name" TEXT NOT NULL,

    CONSTRAINT "Star_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_urlPath_key" ON "Image"("urlPath");

-- CreateIndex
CREATE UNIQUE INDEX "Image_menu_name_key" ON "Image"("menu_name");

-- CreateIndex
CREATE UNIQUE INDEX "MenuReview_id_key" ON "MenuReview"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuReview_menu_name_key" ON "MenuReview"("menu_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentCode_key" ON "User"("studentCode");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_menu_name_fkey" FOREIGN KEY ("menu_name") REFERENCES "Menu"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuReview" ADD CONSTRAINT "MenuReview_menu_name_fkey" FOREIGN KEY ("menu_name") REFERENCES "Menu"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("studentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_menu_name_fkey" FOREIGN KEY ("menu_name") REFERENCES "Menu"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily" ADD CONSTRAINT "Daily_weeklyId_fkey" FOREIGN KEY ("weeklyId") REFERENCES "Weekly"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_rateId_fkey" FOREIGN KEY ("rateId") REFERENCES "MenuReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "User"("studentCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weekly" ADD CONSTRAINT "Weekly_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "Data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
