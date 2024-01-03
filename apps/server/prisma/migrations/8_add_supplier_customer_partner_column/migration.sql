ALTER TABLE `company`
	ADD COLUMN `is_partner` BOOLEAN DEFAULT false,
	ADD COLUMN `is_customer` BOOLEAN DEFAULT false,
    ADD COLUMN `is_supplier` BOOLEAN DEFAULT false;

UPDATE `company` SET 
    `is_partner` = (SELECT `is_partner` FROM `contact` WHERE `contact`.`company_id` = `company`.`id` AND `contact`.`is_partner` = 1 LIMIT 1),
    `is_customer` = (SELECT `is_customer` FROM `contact` WHERE `contact`.`company_id` = `company`.`id` AND `contact`.`is_customer` = 1 LIMIT 1),
    `is_supplier` = (SELECT `is_supplier` FROM `contact` WHERE `contact`.`company_id` = `company`.`id` AND `contact`.`is_supplier` = 1 LIMIT 1);

UPDATE `company` SET `is_partner` = false WHERE `is_partner` IS NULL;
UPDATE `company` SET `is_customer` = false WHERE `is_customer` IS NULL;
UPDATE `company` SET `is_supplier` = false WHERE `is_supplier` IS NULL;

ALTER TABLE `company`
    MODIFY COLUMN `is_partner` BOOLEAN NOT NULL DEFAULT false,
    MODIFY COLUMN `is_customer` BOOLEAN NOT NULL DEFAULT false,
    MODIFY COLUMN `is_supplier` BOOLEAN NOT NULL DEFAULT false;
