SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE `company` ADD COLUMN `partner_id` INTEGER;

UPDATE `company` as c
    set `partner_id` = (SELECT `contact`.`partner_id` FROM `contact` INNER JOIN `company` on `contact`.`company_id` = `company`.`id` WHERE c.`id` = `contact`.`company_id` LIMIT 1);

CREATE INDEX `company_company_idx` ON `company`(`partner_id`);

ALTER TABLE `company` ADD CONSTRAINT `company_partner_id_fk` FOREIGN KEY (`partner_id`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

SET FOREIGN_KEY_CHECKS=1;
