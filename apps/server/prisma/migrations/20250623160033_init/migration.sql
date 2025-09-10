-- CreateTable
CREATE TABLE `afile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `pickup_id` INTEGER NULL,
    `delivery_id` INTEGER NULL,
    `original_client_filename` VARCHAR(255) NOT NULL,
    `unique_server_filename` VARCHAR(255) NOT NULL,
    `discr` VARCHAR(255) NOT NULL,
    `external_id` INTEGER NULL,

    INDEX `IDX_CFAB40EC4584665A`(`product_id`),
    INDEX `IDX_CFAB40ECC26E160B`(`pickup_id`),
    INDEX `IDX_afile_delivery`(`delivery_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aorder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status_id` INTEGER NULL,
    `customer_id` INTEGER NULL,
    `supplier_id` INTEGER NULL,
    `order_nr` VARCHAR(16) NULL,
    `remarks` TEXT NULL,
    `order_date` DATETIME(0) NOT NULL,
    `discount` INTEGER NULL,
    `transport` INTEGER NULL,
    `is_gift` BOOLEAN NULL,
    `discr` VARCHAR(255) NOT NULL,
    `backingPurchaseOrder_id` INTEGER NULL,
    `external_id` INTEGER NULL,
    `vat_rate` FLOAT NULL,

    UNIQUE INDEX `UNIQ_416119D9360A4EAE`(`order_nr`),
    INDEX `IDX_416119D92ADD6D8C`(`supplier_id`),
    INDEX `IDX_416119D930005451`(`backingPurchaseOrder_id`),
    INDEX `IDX_416119D96BF700BD`(`status_id`),
    INDEX `IDX_416119D99395C3F3`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aservice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `relation_id` INTEGER NULL,
    `task_id` INTEGER NULL,
    `status` INTEGER NOT NULL,
    `description` LONGTEXT NULL,
    `discr` VARCHAR(255) NOT NULL,
    `price` INTEGER NULL,

    INDEX `IDX_5923AE03256915B`(`relation_id`),
    INDEX `IDX_5923AE08DB60186`(`task_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_type_filter_id` INTEGER NULL,
    `attr_code` VARCHAR(255) NOT NULL,
    `magento_attr_code` VARCHAR(255) NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` INTEGER NULL,
    `type` INTEGER NULL,
    `has_quantity` BOOLEAN NOT NULL DEFAULT false,
    `external_id` INTEGER NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `UNIQ_FA7AEFFB5E237E06`(`name`),
    INDEX `IDX_FA7AEFFB343A8D62`(`product_type_filter_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute_option` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` INTEGER NULL,
    `external_id` INTEGER NULL,

    INDEX `IDX_78672EEAB6E62EFA`(`attribute_id`),
    UNIQUE INDEX `attribute_option_attr_id_name_key`(`attribute_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fos_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(180) NOT NULL,
    `username_canonical` VARCHAR(180) NOT NULL,
    `email` VARCHAR(180) NOT NULL,
    `enabled` BOOLEAN NOT NULL,
    `salt` VARCHAR(255) NULL,
    `password` VARCHAR(255) NOT NULL,
    `last_login` DATETIME(0) NULL,
    `confirmation_token` VARCHAR(180) NULL,
    `password_requested_at` DATETIME(0) NULL,
    `roles` LONGTEXT NOT NULL,
    `firstname` VARCHAR(255) NULL,
    `lastname` VARCHAR(255) NULL,
    `license_plate` VARCHAR(50) NULL,
    `emailCanonical` VARCHAR(255) NOT NULL,
    `partner_id` INTEGER NULL,

    UNIQUE INDEX `UNIQ_957A647992FC23A8`(`username_canonical`),
    UNIQUE INDEX `UNIQ_957A6479C05FB297`(`confirmation_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `zipcodes` VARCHAR(255) NULL,

    UNIQUE INDEX `UNIQ_5E9E89CB5E237E06`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_purchase` BOOLEAN NOT NULL,
    `is_sale` BOOLEAN NOT NULL,
    `is_repair` BOOLEAN NOT NULL,
    `pindex` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `color` VARCHAR(7) NULL,
    `mailbody` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pickup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NULL,
    `logistics_id` INTEGER NULL,
    `pickup_date` DATETIME(0) NULL,
    `real_pickup_date` DATETIME(0) NULL,
    `origin` VARCHAR(255) NULL,
    `data_destruction` INTEGER NULL,
    `description` LONGTEXT NULL,
    `driver_id` INTEGER NULL,
    `vehicle_id` INTEGER NULL,

    UNIQUE INDEX `UNIQ_419E39FD8D9F6D38`(`order_id`),
    INDEX `idx_pickup_driver`(`driver_id`),
    INDEX `idx_pickup_vehicle`(`vehicle_id`),
    INDEX `idx_realPickupDate`(`real_pickup_date`),
    INDEX `IDX_419E39FD7D418FFA`(`logistics_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_id` INTEGER NULL,
    `location_id` INTEGER NOT NULL,
    `location_label_id` INTEGER NULL,
    `status_id` INTEGER NULL,
    `owner_id` INTEGER NULL,
    `sku` VARCHAR(16) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NULL,
    `price` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `order_updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `external_id` INTEGER NULL,
    `entity_status` INTEGER NOT NULL DEFAULT 0,

    INDEX `IDX_D34A04AD64D218E`(`location_id`),
    INDEX `IDX_D34A04AD6BF700BD`(`status_id`),
    INDEX `IDX_D34A04ADC54C8C93`(`type_id`),
    INDEX `product_location_label_id_fkey`(`location_label_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_attribute` (
    `product_id` INTEGER NOT NULL,
    `attribute_id` INTEGER NOT NULL,
    `value_product_id` INTEGER NULL,
    `value` VARCHAR(255) NULL,
    `quantity` INTEGER NULL,
    `external_id` INTEGER NULL,

    INDEX `IDX_94DA59764584665A`(`product_id`),
    INDEX `IDX_94DA597667C3E2E6`(`value_product_id`),
    INDEX `IDX_94DA5976B6E62EFA`(`attribute_id`),
    PRIMARY KEY (`product_id`, `attribute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `order_id` INTEGER NOT NULL,
    `quantity` INTEGER NULL,
    `price` INTEGER NULL,
    `external_id` INTEGER NULL,

    INDEX `IDX_5475E8C44584665A`(`product_id`),
    INDEX `IDX_5475E8C48D9F6D38`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_stock` BOOLEAN NULL,
    `is_saleable` BOOLEAN NULL,
    `pindex` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `color` VARCHAR(7) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `magento_category_id` VARCHAR(50) NULL,
    `magento_attr_set_id` VARCHAR(50) NULL,
    `magento_group_spec_id` VARCHAR(50) NULL,
    `pindex` INTEGER NULL,
    `comment` LONGTEXT NULL,
    `is_attribute` BOOLEAN NOT NULL DEFAULT false,
    `external_id` INTEGER NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `UNIQ_13675885E237E06`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_type_attribute` (
    `product_type_id` INTEGER NOT NULL,
    `attribute_id` INTEGER NOT NULL,
    `magento_in_attr_set` BOOLEAN NULL,

    INDEX `IDX_1DD5D0C714959723`(`product_type_id`),
    INDEX `IDX_1DD5D0C7B6E62EFA`(`attribute_id`),
    PRIMARY KEY (`product_type_id`, `attribute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_type_task` (
    `product_type_id` INTEGER NOT NULL,
    `task_id` INTEGER NOT NULL,

    INDEX `IDX_EBD1A8A014959723`(`product_type_id`),
    INDEX `IDX_EBD1A8A08DB60186`(`task_id`),
    PRIMARY KEY (`product_type_id`, `task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NULL,
    `description` LONGTEXT NULL,
    `damage` LONGTEXT NULL,

    UNIQUE INDEX `UNIQ_8EE434218D9F6D38`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NULL,
    `pindex` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_location` (
    `user_id` INTEGER NOT NULL,
    `location_id` INTEGER NOT NULL,

    INDEX `IDX_BE136DCB64D218E`(`location_id`),
    INDEX `IDX_BE136DCBA76ED395`(`user_id`),
    PRIMARY KEY (`user_id`, `location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_template` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `template` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `location_template_location_id_fkey`(`location_id`),
    UNIQUE INDEX `location_template_location_id_template_key`(`location_id`, `template`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_label` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `location_label_location_id_fkey`(`location_id`),
    UNIQUE INDEX `location_label_location_id_label_key`(`location_id`, `label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `phone2` VARCHAR(255) NULL,
    `street` VARCHAR(255) NULL,
    `street_extra` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `country` VARCHAR(255) NULL,
    `state` VARCHAR(255) NULL,
    `zip` VARCHAR(255) NULL,
    `street2` VARCHAR(255) NULL,
    `street_extra2` VARCHAR(255) NULL,
    `city2` VARCHAR(255) NULL,
    `country2` VARCHAR(255) NULL,
    `state2` VARCHAR(255) NULL,
    `zip2` VARCHAR(255) NULL,
    `is_main` BOOLEAN NULL,
    `external_id` INTEGER NULL,

    INDEX `contact_company_id_fkey`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partner_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `kvk_nr` INTEGER NULL,
    `is_customer` BOOLEAN NOT NULL DEFAULT false,
    `is_supplier` BOOLEAN NOT NULL DEFAULT false,
    `is_partner` BOOLEAN NOT NULL DEFAULT false,
    `vat_code` INTEGER NULL,

    UNIQUE INDEX `name`(`name`),
    INDEX `company_partner_id_idx`(`partner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `method` VARCHAR(20) NULL,
    `transaction_id` VARCHAR(100) NOT NULL,
    `subscription_id` VARCHAR(100) NULL,
    `amount` FLOAT NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module_payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER NULL,
    `payment_id` INTEGER NULL,
    `price` FLOAT NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `active_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_module_payment_module_idx`(`module_id`),
    INDEX `idx_module_payment_module`(`module_id`),
    INDEX `fk_module_payment_payment_idx`(`payment_id`),
    INDEX `idx_module_payment_payment`(`payment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `price` FLOAT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `config` LONGTEXT NULL,

    UNIQUE INDEX `uniq_module_name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NULL,
    `logistics_id` INTEGER NULL,
    `type` INTEGER NULL,
    `date` DATETIME(0) NULL,
    `instructions` LONGTEXT NULL,
    `dhl_tracking_code` VARCHAR(255) NULL,
    `driver_id` INTEGER NULL,
    `vehicle_id` INTEGER NULL,

    UNIQUE INDEX `uniq_delivery_order_id`(`order_id`),
    INDEX `idx_delivery_driver`(`driver_id`),
    INDEX `idx_delivery_vehicle`(`vehicle_id`),
    INDEX `idx_date`(`date`),
    INDEX `idx_delivery_logistic`(`logistics_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `theme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(255) NOT NULL,
    `palette` LONGTEXT NOT NULL,
    `logo_id` INTEGER NOT NULL,
    `favicon_id` INTEGER NOT NULL,
    `dashboard_message` VARCHAR(255) NULL,

    UNIQUE INDEX `theme_logo_id_key`(`logo_id`),
    UNIQUE INDEX `theme_favicon_id_key`(`favicon_id`),
    INDEX `idx_theme_logo`(`logo_id`),
    INDEX `idx_theme_favicon`(`favicon_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `gender` ENUM('male', 'female') NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT false,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `password` LONGTEXT NOT NULL,
    `refresh_token` LONGTEXT NOT NULL,
    `groups` LONGTEXT NOT NULL,
    `email_confirmation_code` VARCHAR(10) NULL,
    `password_verification_code` VARCHAR(10) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `uniq_username`(`username`),
    UNIQUE INDEX `uniq_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `registration_number` VARCHAR(50) NOT NULL,
    `type` ENUM('car') NULL,

    UNIQUE INDEX `uniq_registration_number`(`registration_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `afile` ADD CONSTRAINT `FK_CFAB40EC4584665A` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `afile` ADD CONSTRAINT `FK_CFAB40ECC26E160B` FOREIGN KEY (`pickup_id`) REFERENCES `pickup`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `afile` ADD CONSTRAINT `FK_afile_delivery` FOREIGN KEY (`delivery_id`) REFERENCES `delivery`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `aorder` ADD CONSTRAINT `FK_416119D92ADD6D8C` FOREIGN KEY (`supplier_id`) REFERENCES `contact`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `aorder` ADD CONSTRAINT `FK_416119D930005451` FOREIGN KEY (`backingPurchaseOrder_id`) REFERENCES `aorder`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `aorder` ADD CONSTRAINT `FK_416119D96BF700BD` FOREIGN KEY (`status_id`) REFERENCES `order_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `aorder` ADD CONSTRAINT `FK_416119D99395C3F3` FOREIGN KEY (`customer_id`) REFERENCES `contact`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `aservice` ADD CONSTRAINT `FK_5923AE03256915B` FOREIGN KEY (`relation_id`) REFERENCES `product_order`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `aservice` ADD CONSTRAINT `FK_5923AE08DB60186` FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `attribute` ADD CONSTRAINT `FK_FA7AEFFB343A8D62` FOREIGN KEY (`product_type_filter_id`) REFERENCES `product_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `attribute_option` ADD CONSTRAINT `FK_78672EEAB6E62EFA` FOREIGN KEY (`attribute_id`) REFERENCES `attribute`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pickup` ADD CONSTRAINT `FK_419E39FD8D9F6D38` FOREIGN KEY (`order_id`) REFERENCES `aorder`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pickup` ADD CONSTRAINT `fk_pickup_driver` FOREIGN KEY (`driver_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pickup` ADD CONSTRAINT `fk_pickup_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `FK_D34A04AD64D218E` FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `FK_D34A04AD6BF700BD` FOREIGN KEY (`status_id`) REFERENCES `product_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `FK_D34A04ADC54C8C93` FOREIGN KEY (`type_id`) REFERENCES `product_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_location_label_id_fkey` FOREIGN KEY (`location_label_id`) REFERENCES `location_label`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_attribute` ADD CONSTRAINT `FK_94DA59764584665A` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_attribute` ADD CONSTRAINT `FK_94DA597667C3E2E6` FOREIGN KEY (`value_product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_attribute` ADD CONSTRAINT `FK_94DA5976B6E62EFA` FOREIGN KEY (`attribute_id`) REFERENCES `attribute`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_order` ADD CONSTRAINT `FK_5475E8C44584665A` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_order` ADD CONSTRAINT `FK_5475E8C48D9F6D38` FOREIGN KEY (`order_id`) REFERENCES `aorder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_type_attribute` ADD CONSTRAINT `FK_1DD5D0C714959723` FOREIGN KEY (`product_type_id`) REFERENCES `product_type`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_type_attribute` ADD CONSTRAINT `FK_1DD5D0C7B6E62EFA` FOREIGN KEY (`attribute_id`) REFERENCES `attribute`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_type_task` ADD CONSTRAINT `FK_EBD1A8A014959723` FOREIGN KEY (`product_type_id`) REFERENCES `product_type`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_type_task` ADD CONSTRAINT `FK_EBD1A8A08DB60186` FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `repair` ADD CONSTRAINT `FK_8EE434218D9F6D38` FOREIGN KEY (`order_id`) REFERENCES `aorder`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_location` ADD CONSTRAINT `FK_BE136DCB64D218E` FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_location` ADD CONSTRAINT `FK_BE136DCBA76ED395` FOREIGN KEY (`user_id`) REFERENCES `fos_user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `location_template` ADD CONSTRAINT `location_template_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location_label` ADD CONSTRAINT `location_label_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_partner_id_fk` FOREIGN KEY (`partner_id`) REFERENCES `company`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `module_payment` ADD CONSTRAINT `fk_module_payment_payment` FOREIGN KEY (`payment_id`) REFERENCES `payment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_payment` ADD CONSTRAINT `module_payment_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `fk_delivery_aorder` FOREIGN KEY (`order_id`) REFERENCES `aorder`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `fk_delivery_driver` FOREIGN KEY (`driver_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `fk_delivery_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `theme` ADD CONSTRAINT `fk_theme_favicon` FOREIGN KEY (`favicon_id`) REFERENCES `afile`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `theme` ADD CONSTRAINT `fk_theme_logo` FOREIGN KEY (`logo_id`) REFERENCES `afile`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
