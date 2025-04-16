-- AlterTable
ALTER TABLE `transaction` MODIFY `transaction_status` ENUM('unpaid', 'paid', 'expired') NOT NULL DEFAULT 'unpaid';
