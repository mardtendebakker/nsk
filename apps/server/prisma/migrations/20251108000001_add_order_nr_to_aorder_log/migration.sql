DELETE FROM `aorder_log`;

ALTER TABLE `aorder_log` ADD COLUMN `order_nr` VARCHAR(255) NULL;
