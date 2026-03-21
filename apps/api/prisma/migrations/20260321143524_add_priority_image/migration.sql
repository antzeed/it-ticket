-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "priority" "TicketPriority" NOT NULL DEFAULT 'LOW';
