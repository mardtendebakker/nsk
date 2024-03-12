ALTER TABLE `attribute` 
MODIFY COLUMN `attr_code` VARCHAR(255) NOT NULL;

ALTER TABLE `attribute_option` 
ADD UNIQUE INDEX `attribute_option_attr_id_name_key` (`attribute_id`, `name`);
