-- CreateTable
CREATE TABLE "LighthouseReport" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "performance" DOUBLE PRECISION NOT NULL,
    "accessibility" DOUBLE PRECISION NOT NULL,
    "bestPractices" DOUBLE PRECISION NOT NULL,
    "seo" DOUBLE PRECISION NOT NULL,
    "pwa" DOUBLE PRECISION,
    "firstContentfulPaint" DOUBLE PRECISION,
    "largestContentfulPaint" DOUBLE PRECISION,
    "totalBlockingTime" DOUBLE PRECISION,
    "cumulativeLayoutShift" DOUBLE PRECISION,
    "speedIndex" DOUBLE PRECISION,
    "fullReport" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LighthouseReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LighthouseScan" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "totalUrls" INTEGER NOT NULL DEFAULT 0,
    "completedUrls" INTEGER NOT NULL DEFAULT 0,
    "failedUrls" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "LighthouseScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LighthouseReport_url_device_createdAt_idx" ON "LighthouseReport"("url", "device", "createdAt");

-- CreateIndex
CREATE INDEX "LighthouseReport_createdAt_idx" ON "LighthouseReport"("createdAt");

-- CreateIndex
CREATE INDEX "LighthouseScan_status_startedAt_idx" ON "LighthouseScan"("status", "startedAt");

-- CreateIndex
CREATE INDEX "MediaAsset_saunaId_idx" ON "MediaAsset"("saunaId");

-- CreateIndex
CREATE INDEX "MediaAsset_saunaId_kind_orderIndex_idx" ON "MediaAsset"("saunaId", "kind", "orderIndex");

-- CreateIndex
CREATE INDEX "MediaAsset_status_idx" ON "MediaAsset"("status");

-- CreateIndex
CREATE INDEX "MediaAsset_creatorId_idx" ON "MediaAsset"("creatorId");

-- CreateIndex
CREATE INDEX "OpeningHour_saunaId_idx" ON "OpeningHour"("saunaId");

-- CreateIndex
CREATE INDEX "OpeningHour_saunaId_type_active_idx" ON "OpeningHour"("saunaId", "type", "active");

-- CreateIndex
CREATE INDEX "PriceItem_saunaId_idx" ON "PriceItem"("saunaId");

-- CreateIndex
CREATE INDEX "PriceItem_active_sorting_idx" ON "PriceItem"("active", "sorting");

-- CreateIndex
CREATE INDEX "Sauna_slug_idx" ON "Sauna"("slug");

-- CreateIndex
CREATE INDEX "Sauna_status_sorting_idx" ON "Sauna"("status", "sorting");

-- CreateIndex
CREATE INDEX "Sauna_status_idx" ON "Sauna"("status");

-- CreateIndex
CREATE INDEX "Sauna_driftStatus_idx" ON "Sauna"("driftStatus");
