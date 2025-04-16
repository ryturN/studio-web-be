/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `category_addons` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `category_packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `categories` DROP COLUMN `deleted_at`;

-- AlterTable
ALTER TABLE `category_addons` DROP COLUMN `deleted_at`;

-- AlterTable
ALTER TABLE `category_packages` DROP COLUMN `deleted_at`;
