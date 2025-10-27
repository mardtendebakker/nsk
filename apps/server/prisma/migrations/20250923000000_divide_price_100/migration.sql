-- Divide price values by 100 for all relevant tables

UPDATE aservice SET price = price / 100;
UPDATE attribute SET price = price / 100;
UPDATE attribute_option SET price = price / 100;
UPDATE product SET price = price / 100;
UPDATE product_order SET price = price / 100;
UPDATE module_payment SET price = price / 100;
UPDATE module SET price = price / 100;