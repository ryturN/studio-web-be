/*
  Warnings:

  - You are about to drop the column `image` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `images` table. All the data in the column will be lost.
  - Added the required column `entity` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `images` DROP COLUMN `image`,
    DROP COLUMN `type`,
    ADD COLUMN `entity` ENUM('category', 'transaction') NOT NULL,
    ADD COLUMN `image_url` VARCHAR(255) NOT NULL;
