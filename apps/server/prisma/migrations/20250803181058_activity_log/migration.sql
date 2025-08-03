-- CreateTable
CREATE TABLE `activity_log` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NULL,
    `groups` VARCHAR(255) NULL,
    `method` VARCHAR(20) NULL,
    `route` VARCHAR(255) NULL,
    `params` LONGTEXT NULL,
    `body` LONGTEXT NULL,
    `model` VARCHAR(30) NULL,
    `action` VARCHAR(20) NULL,
    `before` LONGTEXT NULL,
    `query` LONGTEXT NULL,
    `bulk` BOOLEAN NOT NULL DEFAULT 0,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;