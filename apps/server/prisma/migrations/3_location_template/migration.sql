-- AlterTable
ALTER TABLE `product` ADD COLUMN `location_label_id` INTEGER NULL AFTER location_id;

-- CreateTable
CREATE TABLE `location_template` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `template` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NULL,
    `pindex` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    INDEX `location_template_location_id_fkey`(`location_id`),
    UNIQUE INDEX `location_template_location_id_template_key`(`location_id`, `template`),
    UNIQUE INDEX `location_template_location_id_name_key`(`location_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_label` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    INDEX `location_label_location_id_fkey`(`location_id`),
    UNIQUE INDEX `location_label_location_id_label_key`(`location_id`, `label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `product_location_label_id_fkey` ON `product`(`location_label_id`);

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_location_label_id_fkey` FOREIGN KEY (`location_label_id`) REFERENCES `location_label`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `location_template` ADD CONSTRAINT `location_template_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location_label` ADD CONSTRAINT `location_label_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
