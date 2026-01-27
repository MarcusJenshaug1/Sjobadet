-- CreateTable
CREATE TABLE "OpeningHourOverride" (
    "id" TEXT NOT NULL,
    "saunaId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "opens" TEXT,
    "closes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpeningHourOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpeningHourOverride_saunaId_date_key" ON "OpeningHourOverride"("saunaId", "date");

-- CreateIndex
CREATE INDEX "OpeningHourOverride_saunaId_idx" ON "OpeningHourOverride"("saunaId");

-- CreateIndex
CREATE INDEX "OpeningHourOverride_date_idx" ON "OpeningHourOverride"("date");

-- AddForeignKey
ALTER TABLE "OpeningHourOverride" ADD CONSTRAINT "OpeningHourOverride_saunaId_fkey" FOREIGN KEY ("saunaId") REFERENCES "Sauna"("id") ON DELETE CASCADE ON UPDATE CASCADE;
