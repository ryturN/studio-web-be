-- AlterTable
ALTER TABLE `categories` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `category_addons` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `category_packages` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `picture` VARCHAR(255) NOT NULL DEFAULT 'https://pub-4c954971edd74ba9a4de4352d10bd7ca.r2.dev/profile-picture/profile.png';
