CREATE TABLE `upsellx`.`facebook_collections`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `collection_id` INT(11) NOT NULL,
    `title` VARCHAR(500) NULL,
    `subTitle` VARCHAR(500) NULL,
    `starCount` INT(11) NULL,
    `likeCount` INT(11) NULL,
    `followersCount` INT(11) NULL,
    `checkInCount` INT(11) NULL,
    `location` VARCHAR(500) NULL,
    `phone` VARCHAR(100) NULL,
    `website` VARCHAR(500) NULL,
    `pageCreated` VARCHAR(100) NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;
