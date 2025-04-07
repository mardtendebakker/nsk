-- DropForeignKey
ALTER TABLE `pickup` DROP FOREIGN KEY `FK_419E39FD7D418FFA`;

-- DropForeignKey
ALTER TABLE `delivery` DROP FOREIGN KEY `fk_delivery_logistics`;

-- AlterTable
ALTER TABLE `pickup`
    ADD COLUMN `driver_id` INTEGER NULL,
    ADD COLUMN `vehicle_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `delivery`
    ADD COLUMN `driver_id` INTEGER NULL,
    ADD COLUMN `vehicle_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `registration_number` VARCHAR(50) NOT NULL,
    `type` ENUM('car') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_pickup_driver` ON `pickup`(`driver_id`);

-- CreateIndex
CREATE INDEX `idx_pickup_vehicle` ON `pickup`(`vehicle_id`);

-- CreateIndex
CREATE INDEX `idx_delivery_driver` ON `delivery`(`driver_id`);

-- CreateIndex
CREATE INDEX `idx_delivery_vehicle` ON `delivery`(`vehicle_id`);

-- AddForeignKey
ALTER TABLE `pickup` ADD CONSTRAINT `fk_pickup_driver` FOREIGN KEY (`driver_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pickup` ADD CONSTRAINT `fk_pickup_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `fk_delivery_driver` FOREIGN KEY (`driver_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `fk_delivery_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
