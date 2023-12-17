ALTER TABLE `company`
	ADD COLUMN `is_partner` BOOLEAN DEFAULT false,
	ADD COLUMN `is_customer` BOOLEAN DEFAULT false,
    ADD COLUMN `is_supplier` BOOLEAN DEFAULT false;

UPDATE `company` as c
	SET `is_customer` = (SELECT `contact`.`is_customer` FROM `contact` INNER JOIN `company` on `contact`.`company_id` = `company`.`id` WHERE `contact`.`is_customer` = 1 and `company`.id = c.id LIMIT 1),
	`is_partner` = (SELECT `contact`.`is_partner` FROM `contact` INNER JOIN `company` on `contact`.`company_id` = `company`.`id` WHERE `contact`.`is_partner` = 1 and `company`.id = c.id LIMIT 1),
	`is_supplier` = (SELECT `contact`.`is_supplier` FROM `contact` INNER JOIN `company` on `contact`.`company_id` = `company`.`id` WHERE `contact`.`is_supplier` = 1 and `company`.id = c.id LIMIT 1);

UPDATE `company` SET `is_partner` = false WHERE `is_partner` IS NULL;
UPDATE `company` SET `is_customer` = false WHERE `is_customer` IS NULL;
UPDATE `company` SET `is_supplier` = false WHERE `is_supplier` IS NULL;

ALTER TABLE `company`
    MODIFY COLUMN `is_partner` BOOLEAN NOT NULL DEFAULT false,
    MODIFY COLUMN `is_customer` BOOLEAN NOT NULL DEFAULT false,
    MODIFY COLUMN `is_supplier` BOOLEAN NOT NULL DEFAULT false;
