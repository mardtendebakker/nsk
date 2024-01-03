SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE `company` ADD COLUMN `partner_id` INTEGER;

UPDATE `company` AS `c`
    set `partner_id` = 
    (
        SELECT `contact`.`company_id` FROM `contact` as `parent_contact`
        INNER JOIN `contact` as `child_contact` on `child_contact`.`partner_id` = `parent_contact`.`id` 
        WHERE `c`.`id` = `child_contact`.`company_id` LIMIT 1
    );

CREATE INDEX `company_company_idx` ON `company`(`partner_id`);

ALTER TABLE `company` ADD CONSTRAINT `company_partner_id_fk` FOREIGN KEY (`partner_id`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

SET FOREIGN_KEY_CHECKS=1;
