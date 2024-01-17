/* add_supplier_customer_column */
UPDATE `contact`
    SET `is_partner` = (CASE WHEN `is_partner` > 0 THEN 1 ELSE 0 END);
ALTER TABLE `contact`
    MODIFY COLUMN `is_partner` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_customer` BOOLEAN NOT NULL DEFAULT false AFTER `is_partner`,
    ADD COLUMN `is_supplier` BOOLEAN NOT NULL DEFAULT false AFTER `is_partner`;
UPDATE `contact`
    SET `is_customer` = (CASE WHEN `discr` = 'c' THEN true ELSE false END),
    `is_supplier` = (CASE WHEN `discr` = 's' THEN true ELSE false END);

/* add_supplier_customer_partner_column */
ALTER TABLE `company`
	ADD COLUMN `is_customer` BOOLEAN DEFAULT false AFTER `kvk_nr`,
    ADD COLUMN `is_supplier` BOOLEAN DEFAULT false AFTER `is_customer`,
	ADD COLUMN `is_partner` BOOLEAN DEFAULT false AFTER `is_supplier`;

UPDATE `company` SET
    `is_customer` = (SELECT `is_customer` FROM `contact` WHERE `contact`.`company_id` = `company`.`id` AND `contact`.`is_customer` = 1 LIMIT 1),
    `is_supplier` = (SELECT `is_supplier` FROM `contact` WHERE `contact`.`company_id` = `company`.`id` AND `contact`.`is_supplier` = 1 LIMIT 1),
    `is_partner` = (SELECT `is_partner` FROM `contact` WHERE `contact`.`company_id` = `company`.`id` AND `contact`.`is_partner` = 1 LIMIT 1);

UPDATE `company` SET `is_customer` = false WHERE `is_customer` IS NULL;
UPDATE `company` SET `is_supplier` = false WHERE `is_supplier` IS NULL;
UPDATE `company` SET `is_partner` = false WHERE `is_partner` IS NULL;

ALTER TABLE `company`
    MODIFY COLUMN `is_customer` BOOLEAN NOT NULL DEFAULT false,
    MODIFY COLUMN `is_supplier` BOOLEAN NOT NULL DEFAULT false,
    MODIFY COLUMN `is_partner` BOOLEAN NOT NULL DEFAULT false;

/* add_partner_id_to_company */
SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE `company` ADD COLUMN `partner_id` INTEGER AFTER `id`;

UPDATE `company` AS `c`
    set `partner_id` = 
    (
        SELECT `parent_contact`.`company_id` FROM `contact` AS `parent_contact`
        INNER JOIN `contact` AS `child_contact` on `child_contact`.`partner_id` = `parent_contact`.`id` 
        WHERE `c`.`id` = `child_contact`.`company_id` LIMIT 1
    );

CREATE INDEX `company_partner_id_idx` ON `company`(`partner_id`);

ALTER TABLE `company` ADD CONSTRAINT `company_partner_id_fkey` 
    FOREIGN KEY (`partner_id`)
    REFERENCES `company`(`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION;

/* drop useless column */
ALTER TABLE `contact`
    DROP COLUMN `discr`;

ALTER TABLE `contact` DROP FOREIGN KEY `FK_ABB0A97D9393F8FE`;
ALTER TABLE `contact` DROP INDEX `IDX_ABB0A97D9393F8FE`;

ALTER TABLE `contact`
    DROP COLUMN `partner_id`,
    DROP COLUMN `is_customer`,
    DROP COLUMN `is_supplier`,
    DROP COLUMN `is_partner`;

ALTER TABLE `fos_user` DROP FOREIGN KEY `FK_957A64799393F8FE`;
ALTER TABLE `fos_user` DROP INDEX `IDX_957A64799393F8FE`;

ALTER TABLE `product` DROP FOREIGN KEY `FK_D34A04AD7E3C61F9`;
ALTER TABLE `product` DROP INDEX `IDX_D34A04AD7E3C61F9`;

SET FOREIGN_KEY_CHECKS=1;
