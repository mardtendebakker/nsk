-- AlterTable
ALTER TABLE `company` ADD COLUMN `tax_code` INTEGER NOT NULL DEFAULT 2 AFTER `is_partner`;
ALTER TABLE `aorder` ADD COLUMN `tax_rate` FLOAT NOT NULL DEFAULT 21 AFTER `external_id`;
