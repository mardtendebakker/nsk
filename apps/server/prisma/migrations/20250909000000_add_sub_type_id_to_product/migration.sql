-- AlterTable
ALTER TABLE `product` ADD COLUMN `sub_type_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_sub_type_id_fkey` FOREIGN KEY (`sub_type_id`) REFERENCES `product_sub_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
