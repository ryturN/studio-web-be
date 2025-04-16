/*
  Warnings:

  - You are about to drop the column `status` on the `transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_category_id_fkey`;

-- AlterTable
ALTER TABLE `images` ADD COLUMN `transaction_detail_id` INTEGER NULL,
    MODIFY `category_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `status`,
    ADD COLUMN `transaction_status` ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid';

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_transaction_detail_id_fkey` FOREIGN KEY (`transaction_detail_id`) REFERENCES `transaction_details`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
