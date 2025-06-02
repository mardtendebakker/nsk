ALTER TABLE `user` ADD UNIQUE INDEX `uniq_username` (`username`);
ALTER TABLE `user` ADD UNIQUE INDEX `uniq_email` (`email`);
