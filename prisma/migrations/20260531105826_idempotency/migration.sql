/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idempotencyKey]` on the table `TodoList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idempotencyKey` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idempotencyKey` to the `TodoList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "idempotencyKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TodoList" ADD COLUMN     "idempotencyKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Todo_idempotencyKey_key" ON "Todo"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "TodoList_idempotencyKey_key" ON "TodoList"("idempotencyKey");
