/*
  Warnings:

  - A unique constraint covering the columns `[logo_id]` on the table `theme` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[favicon_id]` on the table `theme` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `theme_logo_id_key` ON `theme`(`logo_id`);

-- CreateIndex
CREATE UNIQUE INDEX `theme_favicon_id_key` ON `theme`(`favicon_id`);
