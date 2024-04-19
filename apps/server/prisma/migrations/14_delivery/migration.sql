-- CreateTable
CREATE TABLE `delivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NULL,
    `logistics_id` INTEGER NULL,
    `type` INTEGER NULL,
    `date` DATETIME(0) NULL,
    `instructions` LONGTEXT NULL,

    UNIQUE INDEX `uniq_delivery_order_id`(`order_id`),
    INDEX `idx_delivery_logistic`(`logistics_id`),
    INDEX `idx_date`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `fk_delivery_logistics` FOREIGN KEY (`logistics_id`) REFERENCES `fos_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `fk_delivery_aorder` FOREIGN KEY (`order_id`) REFERENCES `aorder`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

INSERT INTO `delivery` (`order_id`,`type`,`date`,`instructions`)
SELECT `id`, `delivery_type`, `delivery_date`, `delivery_instructions` FROM `aorder`
WHERE `delivery_type` IS NOT NULL;

-- DropIndex
DROP INDEX `idx_deliveryDate` ON `aorder`;

-- AlterTable
ALTER TABLE `aorder` DROP COLUMN `delivery_date`,
    DROP COLUMN `delivery_instructions`,
    DROP COLUMN `delivery_type`;
