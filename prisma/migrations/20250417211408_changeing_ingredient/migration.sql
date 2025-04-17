/*
  Warnings:

  - A unique constraint covering the columns `[ingredientId]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "ingredientId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_ingredientId_key" ON "Ingredient"("ingredientId");
