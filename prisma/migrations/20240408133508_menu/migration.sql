-- CreateEnum
CREATE TYPE "DoW" AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');

-- CreateTable
CREATE TABLE "data" (
    "id" TEXT NOT NULL,

    CONSTRAINT "data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu" (
    "id" TEXT NOT NULL,
    "dataId" TEXT NOT NULL,
    "Day" "DoW" NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_imbed" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "lunch" TEXT[],
    "dinner" TEXT[],

    CONSTRAINT "menu_imbed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "data_id_key" ON "data"("id");

-- CreateIndex
CREATE UNIQUE INDEX "menu_id_key" ON "menu"("id");

-- CreateIndex
CREATE UNIQUE INDEX "menu_imbed_id_key" ON "menu_imbed"("id");

-- CreateIndex
CREATE UNIQUE INDEX "menu_imbed_menuId_key" ON "menu_imbed"("menuId");

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_imbed" ADD CONSTRAINT "menu_imbed_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
