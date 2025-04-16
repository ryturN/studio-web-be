-- AlterTable
ALTER TABLE `transaction` MODIFY `transaction_status` ENUM('unpaid', 'half', 'paid') NOT NULL DEFAULT 'unpaid';
