-- AlterTable
ALTER TABLE `product_type` ADD COLUMN `magento_attr_set_id` VARCHAR(50) NULL DEFAULT NULL AFTER `magento_category_id`;

-- AlterTable
ALTER TABLE `attribute` ADD COLUMN `magento_attr_code` VARCHAR(255) NULL DEFAULT NULL AFTER `attr_code`;
