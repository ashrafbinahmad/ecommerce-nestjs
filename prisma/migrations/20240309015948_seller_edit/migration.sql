/*
  Warnings:

  - Added the required column `company_name` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Seller" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT
);
INSERT INTO "new_Seller" ("createdAt", "email", "hash", "hashedRt", "id", "updatedAt") SELECT "createdAt", "email", "hash", "hashedRt", "id", "updatedAt" FROM "Seller";
DROP TABLE "Seller";
ALTER TABLE "new_Seller" RENAME TO "Seller";
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");
CREATE UNIQUE INDEX "Seller_company_name_key" ON "Seller"("company_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
