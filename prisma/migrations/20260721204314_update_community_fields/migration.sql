/*
  Warnings:

  - The primary key for the `Community` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Community` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `about` on table `Community` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Community" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "members" INTEGER NOT NULL DEFAULT 0,
    "discord" TEXT NOT NULL,
    "roblox" TEXT,
    "about" TEXT NOT NULL,
    "staff" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Community" ("about", "createdAt", "description", "discord", "icon", "id", "image", "members", "name", "roblox", "slug", "staff", "type") SELECT "about", "createdAt", "description", "discord", "icon", "id", "image", "members", "name", "roblox", "slug", "staff", "type" FROM "Community";
DROP TABLE "Community";
ALTER TABLE "new_Community" RENAME TO "Community";
CREATE UNIQUE INDEX "Community_slug_key" ON "Community"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
