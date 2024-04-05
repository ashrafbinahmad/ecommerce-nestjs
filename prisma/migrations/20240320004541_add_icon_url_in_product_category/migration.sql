-- AlterTable
ALTER TABLE "Product_category" ADD COLUMN "icon_url" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cart_item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ADDED',
    CONSTRAINT "Cart_item_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cart_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cart_item" ("createdAt", "customerId", "id", "productId", "quantity", "updatedAt") SELECT "createdAt", "customerId", "id", "productId", "quantity", "updatedAt" FROM "Cart_item";
DROP TABLE "Cart_item";
ALTER TABLE "new_Cart_item" RENAME TO "Cart_item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
