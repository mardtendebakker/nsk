UPDATE `contact`
    SET `is_partner` = (CASE WHEN `is_partner` > 0 THEN 1 ELSE 0 END);
ALTER TABLE `contact`
    MODIFY COLUMN `is_partner` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_customer` BOOLEAN NOT NULL DEFAULT true AFTER `is_partner`,
    ADD COLUMN `is_supplier` BOOLEAN NOT NULL DEFAULT false AFTER `is_partner`;
UPDATE `contact`
    SET `is_customer` = (CASE WHEN `discr` = 'c' THEN true ELSE false END),
    `is_supplier` = (CASE WHEN `discr` = 's' THEN true ELSE false END);
ALTER TABLE `contact`
    DROP COLUMN `discr`;
