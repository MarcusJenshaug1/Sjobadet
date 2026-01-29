-- Add coordinates for Yr water temperature lookup
ALTER TABLE "Sauna"
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION;

-- Cache nearest water temperature from Yr
ALTER TABLE "Sauna"
ADD COLUMN "waterTempValue" DOUBLE PRECISION,
ADD COLUMN "waterTempTime" TIMESTAMP(3),
ADD COLUMN "waterTempLocationName" TEXT,
ADD COLUMN "waterTempDistanceKm" DOUBLE PRECISION,
ADD COLUMN "waterTempFetchedAt" TIMESTAMP(3);