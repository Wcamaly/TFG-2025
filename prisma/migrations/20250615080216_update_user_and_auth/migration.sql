/*
  Warnings:

  - You are about to drop the column `email` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `failedAttempts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isLocked` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastFailedAttempt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lockExpiresAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `auth` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "auth_email_idx";

-- DropIndex
DROP INDEX "auth_email_key";

-- DropIndex
DROP INDEX "auth_role_idx";

-- AlterTable
ALTER TABLE "auth" DROP COLUMN "email",
DROP COLUMN "isVerified",
ADD COLUMN     "failedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastFailedAttempt" TIMESTAMP(3),
ADD COLUMN     "lockExpiresAt" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "failedAttempts",
DROP COLUMN "isActive",
DROP COLUMN "isLocked",
DROP COLUMN "lastFailedAttempt",
DROP COLUMN "lastLogin",
DROP COLUMN "lockExpiresAt",
DROP COLUMN "metadata",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "role";

-- CreateIndex
CREATE UNIQUE INDEX "auth_userId_key" ON "auth"("userId");

-- AddForeignKey
ALTER TABLE "auth" ADD CONSTRAINT "auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
