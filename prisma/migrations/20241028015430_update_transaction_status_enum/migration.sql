/*
  Warnings:

  - The values [half] on the enum `Transaction_transaction_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `transaction` MODIFY `transaction_status` ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid';
