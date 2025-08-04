-- CreateTable
CREATE TABLE `activity_log` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NULL,
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

-- CreateTable
CREATE TABLE `user_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_group_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_activity_logTouser_group` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_activity_logTouser_group_AB_unique`(`A`, `B`),
    INDEX `_activity_logTouser_group_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_activity_logTouser_group` ADD CONSTRAINT `_activity_logTouser_group_A_fkey` FOREIGN KEY (`A`) REFERENCES `activity_log`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_activity_logTouser_group` ADD CONSTRAINT `_activity_logTouser_group_B_fkey` FOREIGN KEY (`B`) REFERENCES `user_group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;