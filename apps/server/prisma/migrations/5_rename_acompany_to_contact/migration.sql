-- DropForeignKey
ALTER TABLE `acompany` DROP FOREIGN KEY `FK_ABB0A97D9393F8FE`;
-- RenameTable
ALTER TABLE `acompany` RENAME TO  `contact` ;
-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `FK_ABB0A97D9393F8FE` FOREIGN KEY (`partner_id`) REFERENCES `contact` (`id`);
