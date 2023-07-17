-- CreateTable
CREATE TABLE "Punishments" (
    "infractions" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "punishment" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0
);
