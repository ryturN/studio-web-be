/*
  Warnings:

  - Made the column `category_id` on table `category_packages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `category_packages` DROP FOREIGN KEY `category_packages_category_id_fkey`;

-- AlterTable
ALTER TABLE `category_packages` MODIFY `category_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `reservations` ADD COLUMN `success_at` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `category_packages` ADD CONSTRAINT `category_packages_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
