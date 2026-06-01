/*
  Warnings:

  - Added the required column `month` to the `categoryBudget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categoryBudget" ADD COLUMN     "month" TEXT NOT NULL;
