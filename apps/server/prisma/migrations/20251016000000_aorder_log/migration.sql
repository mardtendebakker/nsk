-- CreateTable
CREATE TABLE `aorder_log` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `previous_status_id` INT NOT NULL,
    `status_id` INT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    PRIMARY KEY (`id`),
    INDEX `aorder_log_previous_status_id_idx`(`previous_status_id`),
    INDEX `aorder_log_status_id_idx`(`status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aorder_log` ADD CONSTRAINT `aorder_log_previous_status_id_fkey` FOREIGN KEY (`previous_status_id`) REFERENCES `order_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `aorder_log` ADD CONSTRAINT `aorder_log_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `order_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

