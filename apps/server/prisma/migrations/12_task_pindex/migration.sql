ALTER TABLE `task` 
ADD COLUMN `pindex` INT AFTER `description`;

ALTER TABLE `module_payment` 
ADD INDEX `fk_module_payment_payment_idx` (`payment_id` ASC) VISIBLE;

ALTER TABLE `module_payment` 
ADD CONSTRAINT `fk_module_payment_payment`
  FOREIGN KEY (`payment_id`)
  REFERENCES `payment` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
