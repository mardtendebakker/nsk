-- AlterTable
ALTER TABLE `order_status`
ADD COLUMN `is_repair` TINYINT(1) NOT NULL AFTER `is_sale`,
CHANGE COLUMN `is_purchase` `is_purchase` TINYINT(1) NOT NULL AFTER `id`;
