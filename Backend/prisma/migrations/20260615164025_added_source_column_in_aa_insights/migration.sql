/*
  Warnings:

  - Added the required column `source` to the `AIInsight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIInsight" ADD COLUMN     "source" TEXT NOT NULL;
