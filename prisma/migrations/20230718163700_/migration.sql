/*
  Warnings:

  - You are about to drop the `Punishments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Punishments";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Infractions" (
    "points" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "punishment" INTEGER NOT NULL DEFAULT 0,
    "duration" BIGINT NOT NULL DEFAULT 0
);
