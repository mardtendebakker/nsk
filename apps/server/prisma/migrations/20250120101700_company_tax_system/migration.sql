-- AlterTable
ALTER TABLE `company` ADD COLUMN `tax_code` INTEGER NOT NULL DEFAULT 2 AFTER `is_partner`;
ALTER TABLE `aorder` ADD COLUMN `tax_rate` FLOAT NOT NULL DEFAULT 21 AFTER `external_id`;

UPDATE `company` SET `tax_code`=5 WHERE `id` IN (93, 3402, 8919, 535, 125, 8269);

UPDATE `aorder` o
JOIN `contact` c ON c.id = o.supplier_id OR c.id = o.customer_id
JOIN `company` co ON co.id = c.company_id
SET o.tax_rate = 0
WHERE co.tax_code <> 2;


UPDATE `product_order` po
JOIN `aorder` o ON o.id = po.order_id
SET po.price = po.price / (1 + (o.tax_rate / 100));

UPDATE `aorder` SET `transport` = `transport` / (1 + (`tax_rate`/100))
WHERE `transport` IS NOT NULL;
