-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `gender` ENUM('male', 'female') NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT 0,
    `email_verified` BOOLEAN NOT NULL DEFAULT 0,
    `password` LONGTEXT NOT NULL,
    `refresh_token` LONGTEXT NOT NULL,
    `groups` JSON NOT NULL,
    `email_confirmation_code` VARCHAR(10) NULL,
    `password_verification_code` VARCHAR(10) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
