/*
  Warnings:

  - You are about to alter the column `duration` on the `Punishments` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Punishments" (
    "infractions" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "punishment" INTEGER NOT NULL DEFAULT 0,
    "duration" BIGINT NOT NULL DEFAULT 0
);
INSERT INTO "new_Punishments" ("duration", "infractions", "punishment") SELECT "duration", "infractions", "punishment" FROM "Punishments";
DROP TABLE "Punishments";
ALTER TABLE "new_Punishments" RENAME TO "Punishments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
