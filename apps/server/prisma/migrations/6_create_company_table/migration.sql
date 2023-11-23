-- TrimField
UPDATE `contact` SET `name` = TRIM(`name`);
-- CreateTable
CREATE TABLE IF NOT EXISTS `company` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `kvk_nr` INT
);
-- Insert unique company names and it's kvk_nr and main_contact into the company table
INSERT INTO `company` (`name`, `kvk_nr`)
SELECT `name`, `kvk_nr` FROM `contact`
WHERE `id` IN (SELECT MAX(`id`) FROM `contact` GROUP BY `name`);
-- AddNewColumn
ALTER TABLE `contact`
    ADD COLUMN `company_id` INT NOT NULL AFTER `partner_id`,
    ADD COLUMN `is_main` TINYINT(1) AFTER `is_partner`;
-- Update the contact table with the corresponding company_id
UPDATE `contact` SET `company_id` = (SELECT `id` FROM `company` WHERE `name` = `contact`.`name` LIMIT 1);
-- Update the is_main in contact table
UPDATE `contact` `c`
JOIN (
    SELECT MAX(`id`) AS `max_id`
    FROM `contact`
    GROUP BY name
) AS `max_ids`
ON `c`.`id` = `max_ids`.`max_id`
SET `c`.`is_main` = 1;
-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`);
-- DropColumn
ALTER TABLE `contact`
    DROP COLUMN `name`,
    DROP COLUMN `kvk_nr`;
-- RenameColumn
ALTER TABLE `contact` RENAME COLUMN `representative` TO `name`;
