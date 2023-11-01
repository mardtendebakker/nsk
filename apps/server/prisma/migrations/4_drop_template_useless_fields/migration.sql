/*
  Warnings:

  - You are about to drop the column `description` on the `location_template` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `location_template` table. All the data in the column will be lost.
  - You are about to drop the column `pindex` on the `location_template` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `location_template_location_id_name_key` ON `location_template`;

-- AlterTable
ALTER TABLE `location_template` DROP COLUMN `description`,
    DROP COLUMN `name`,
    DROP COLUMN `pindex`;
