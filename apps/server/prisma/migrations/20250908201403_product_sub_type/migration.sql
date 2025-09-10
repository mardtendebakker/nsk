-- CreateTable
CREATE TABLE `product_sub_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_type_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `magento_category_id` VARCHAR(50) NULL,
    `magento_attr_set_id` VARCHAR(50) NULL,
    `magento_group_spec_id` VARCHAR(50) NULL,
    `pindex` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_sub_type` ADD CONSTRAINT `product_sub_type_product_type_id_fkey` FOREIGN KEY (`product_type_id`) REFERENCES `product_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
