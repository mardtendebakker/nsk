CREATE TABLE `stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    
    PRIMARY KEY (`id`),
    INDEX `idx_product` (`product_id`),
    UNIQUE KEY `uk_product_id` (`product_id`),
    
    CONSTRAINT `fk_product` 
        FOREIGN KEY (`product_id`) 
        REFERENCES `product` (`id`) 
        ON DELETE CASCADE 
        ON UPDATE RESTRICT
);