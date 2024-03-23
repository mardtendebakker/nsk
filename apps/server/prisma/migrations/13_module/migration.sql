-- AlterTable
ALTER TABLE `module_payment` ADD COLUMN `module_id` INTEGER NULL AFTER `id`;

-- CreateTable
CREATE TABLE `module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `price` FLOAT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `config` LONGTEXT NULL,

    UNIQUE INDEX `uniq_module_name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `module` (id, name) VALUES (1, 'blancco');
INSERT INTO `module` (id, name) VALUES (2, 'customer_contact_action');
INSERT INTO `module` (id, name) VALUES (3, 'logistics');
INSERT INTO `module` (id, name) VALUES (4, 'attributes');
INSERT INTO `module` (id, name) VALUES (5, 'tasks');
INSERT INTO `module` (id, name) VALUES (6, 'product_statuses');
INSERT INTO `module` (id, name) VALUES (7, 'order_statuses');
INSERT INTO `module` (id, name) VALUES (8, 'tracking');

-- CreateIndex
CREATE INDEX `fk_module_payment_module_idx` ON `module_payment`(`module_id`);

-- CreateIndex
CREATE INDEX `idx_module_payment_module` ON `module_payment`(`module_id`);

-- AddForeignKey
ALTER TABLE `module_payment` ADD CONSTRAINT `module_payment_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE `module_payment` SET `module_id` = 1 WHERE `module_name` = 'blancco';
UPDATE `module_payment` SET `module_id` = 2 WHERE `module_name` = 'customer_contact_action';
UPDATE `module_payment` SET `module_id` = 3 WHERE `module_name` = 'logistics';
UPDATE `module_payment` SET `module_id` = 4 WHERE `module_name` = 'attributes';
UPDATE `module_payment` SET `module_id` = 5 WHERE `module_name` = 'tasks';
UPDATE `module_payment` SET `module_id` = 6 WHERE `module_name` = 'product_statuses';
UPDATE `module_payment` SET `module_id` = 7 WHERE `module_name` = 'order_statuses';
UPDATE `module_payment` SET `module_id` = 8 WHERE `module_name` = 'tracking';

ALTER TABLE `module_payment` DROP COLUMN `module_name`;
