-- CreateTable
CREATE TABLE "user" (
    "name" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");
