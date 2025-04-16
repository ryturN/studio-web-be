/*
  Warnings:

  - The values [paidoff] on the enum `transaction_details_transaction_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `transaction_type` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `transaction_type` ENUM('downpayment', 'fullpayment') NOT NULL;

-- AlterTable
ALTER TABLE `transaction_details` MODIFY `transaction_type` ENUM('downpayment', 'fullpayment') NOT NULL;
