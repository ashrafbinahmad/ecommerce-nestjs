/*
  Warnings:

  - Added the required column `stock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "material" TEXT,
    "weight_grams" INTEGER,
    "price_rupee" INTEGER NOT NULL,
    "offer_price_rupee" INTEGER,
    "thumb_image_url" TEXT NOT NULL,
    "image_1_url" TEXT,
    "image_2_url" TEXT,
    "image_3_url" TEXT,
    "stock" INTEGER NOT NULL,
    "brandId" INTEGER,
    "product_categoryId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sellerId" INTEGER,
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_product_categoryId_fkey" FOREIGN KEY ("product_categoryId") REFERENCES "Product_category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("brandId", "color", "createdAt", "id", "image_1_url", "image_2_url", "image_3_url", "material", "name", "offer_price_rupee", "price_rupee", "product_categoryId", "sellerId", "thumb_image_url", "updatedAt", "weight_grams") SELECT "brandId", "color", "createdAt", "id", "image_1_url", "image_2_url", "image_3_url", "material", "name", "offer_price_rupee", "price_rupee", "product_categoryId", "sellerId", "thumb_image_url", "updatedAt", "weight_grams" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
