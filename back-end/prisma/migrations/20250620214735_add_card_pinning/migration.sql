-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pinnedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Card_pinned_pinnedAt_idx" ON "Card"("pinned", "pinnedAt");
