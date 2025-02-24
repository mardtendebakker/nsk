-- AlterTable
ALTER TABLE `company` CHANGE COLUMN `tax_code` `vat_code` INTEGER;
ALTER TABLE `aorder` CHANGE COLUMN `tax_rate` `vat_rate` FLOAT;
