-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `exprired_at` DATETIME(3) NULL,
    MODIFY `status` ENUM('unpaid', 'downpayment', 'paid') NOT NULL DEFAULT 'unpaid';
