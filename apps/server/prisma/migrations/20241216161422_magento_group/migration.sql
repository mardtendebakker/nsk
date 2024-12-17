-- AlterTable
ALTER TABLE `product_type` ADD COLUMN `magento_group_details_id` VARCHAR(50) NULL DEFAULT NULL AFTER `magento_attr_set_id`;