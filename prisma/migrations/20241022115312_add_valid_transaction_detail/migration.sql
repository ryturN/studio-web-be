/*
  Warnings:

  - A unique constraint covering the columns `[reservation_id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `transaction_details` ADD COLUMN `is_valid` ENUM('true', 'false') NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Transaction_reservation_id_key` ON `Transaction`(`reservation_id`);
