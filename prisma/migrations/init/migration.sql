-- CreateTable
CREATE TABLE "User" (
    "studentCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "major" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("studentCode")
);

-- CreateTable
CREATE TABLE "Menu" (
    "name" TEXT NOT NULL,
    "imagePath" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Star" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "menu_name" TEXT NOT NULL,

    CONSTRAINT "Star_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Daily" (
    "id" TEXT NOT NULL,
    "weeklyId" TEXT,

    CONSTRAINT "Daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "menu_name" TEXT NOT NULL,
    "writer_id" TEXT,
    "nickname" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "substance" TEXT,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "diet" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Data" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weekly" (
    "id" TEXT NOT NULL,
    "dataId" TEXT,
    "day" TIMESTAMP(3) NOT NULL,

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
CREATE UNIQUE INDEX "User_studentCode_key" ON "User"("studentCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

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

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("studentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_menu_name_fkey" FOREIGN KEY ("menu_name") REFERENCES "Menu"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily" ADD CONSTRAINT "Daily_weeklyId_fkey" FOREIGN KEY ("weeklyId") REFERENCES "Weekly"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_menu_name_fkey" FOREIGN KEY ("menu_name") REFERENCES "Menu"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "User"("studentCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weekly" ADD CONSTRAINT "Weekly_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "Data"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_daily_lunch" ADD CONSTRAINT "_daily_lunch_A_fkey" FOREIGN KEY ("A") REFERENCES "Daily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_daily_lunch" ADD CONSTRAINT "_daily_lunch_B_fkey" FOREIGN KEY ("B") REFERENCES "Menu"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_daily_dinner" ADD CONSTRAINT "_daily_dinner_A_fkey" FOREIGN KEY ("A") REFERENCES "Daily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_daily_dinner" ADD CONSTRAINT "_daily_dinner_B_fkey" FOREIGN KEY ("B") REFERENCES "Menu"("name") ON DELETE CASCADE ON UPDATE CASCADE;

