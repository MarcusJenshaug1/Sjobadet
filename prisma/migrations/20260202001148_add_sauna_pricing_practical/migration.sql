-- Add pricing and practical info fields to Sauna
ALTER TABLE "Sauna"
    ADD COLUMN "priceCurrency" TEXT NOT NULL DEFAULT 'NOK',
    ADD COLUMN "priceDropinMember" DOUBLE PRECISION,
    ADD COLUMN "priceDropinRegular" DOUBLE PRECISION,
    ADD COLUMN "pricePrivatMember" DOUBLE PRECISION,
    ADD COLUMN "pricePrivatRegular" DOUBLE PRECISION,
    ADD COLUMN "priceNote" TEXT,
    ADD COLUMN "parkingInfo" TEXT,
    ADD COLUMN "lockerInfo" TEXT,
    ADD COLUMN "accessibilityInfo" TEXT,
    ADD COLUMN "coldPlungeInfo" TEXT;
