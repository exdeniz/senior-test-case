-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ask" TEXT NOT NULL,
    "avgPrice" DECIMAL NOT NULL,
    "bid" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "executedVolume" DECIMAL NOT NULL,
    "factor" INTEGER NOT NULL,
    "fixPrice" DECIMAL NOT NULL,
    "fundsFee" DECIMAL NOT NULL,
    "fundsReceived" DECIMAL NOT NULL,
    "marketId" TEXT NOT NULL,
    "originVolume" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL,
    "received" DECIMAL NOT NULL,
    "state" TEXT NOT NULL,
    "tradesCount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "volume" DECIMAL NOT NULL
);
INSERT INTO "new_Orders" ("ask", "avgPrice", "bid", "createdAt", "direction", "executedVolume", "factor", "fixPrice", "fundsFee", "fundsReceived", "id", "marketId", "originVolume", "price", "received", "state", "tradesCount", "type", "volume") SELECT "ask", "avgPrice", "bid", "createdAt", "direction", "executedVolume", "factor", "fixPrice", "fundsFee", "fundsReceived", "id", "marketId", "originVolume", "price", "received", "state", "tradesCount", "type", "volume" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
