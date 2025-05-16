-- AlterTable
ALTER TABLE `afile` 
DROP FOREIGN KEY `FK_CFAB40EC8D9F6D38`;

-- AlterColumn CreateIndex DropIndex
ALTER TABLE `afile` 
CHANGE COLUMN `order_id` `delivery_id` INT(11) NULL DEFAULT NULL AFTER `pickup_id`,
ADD INDEX `IDX_afile_delivery` (`delivery_id` ASC) VISIBLE,
DROP INDEX `IDX_CFAB40EC8D9F6D38`;

-- AddForeignKey
ALTER TABLE `afile` 
ADD CONSTRAINT `FK_afile_delivery`
  FOREIGN KEY (`delivery_id`)
  REFERENCES `delivery` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;