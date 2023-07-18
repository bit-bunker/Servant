/*
  Warnings:

  - A unique constraint covering the columns `[points]` on the table `Infractions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Punishments" (
    "case" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "punishment" INTEGER NOT NULL,
    "duration" BIGINT NOT NULL,
    "when" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Infractions_points_key" ON "Infractions"("points");
