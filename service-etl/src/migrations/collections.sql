CREATE TABLE `collections`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `ref_id` CHAR(36) NOT NULL,
    `website` VARCHAR(512) NOT NULL,
    `status` CHAR(10) NOT NULL,
    `fbError` CHAR(1) NOT NULL,
    `twtError` CHAR(1) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;
