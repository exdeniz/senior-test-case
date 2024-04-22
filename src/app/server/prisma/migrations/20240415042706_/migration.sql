-- CreateTable
CREATE TABLE "Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
