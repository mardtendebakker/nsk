ALTER TABLE `product` 
ADD COLUMN `order_updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP AFTER `updated_at`;
