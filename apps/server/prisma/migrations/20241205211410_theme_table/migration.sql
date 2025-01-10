CREATE TABLE `theme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(255) NOT NULL,
    `palette` JSON NOT NULL,
    `logo_id` INTEGER NOT NULL,
    `favicon_id` INTEGER NOT NULL,

    INDEX `idx_theme_logo`(`logo_id`),
    INDEX `idx_theme_favicon`(`favicon_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `theme` ADD CONSTRAINT `fk_theme_logo` FOREIGN KEY (`logo_id`) REFERENCES `afile`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `theme` ADD CONSTRAINT `fk_theme_favicon` FOREIGN KEY (`favicon_id`) REFERENCES `afile`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
