CREATE TABLE `upsellx`.`twitter_collections`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `collection_id` INT(11) NOT NULL,
    `pageCreated` VARCHAR(200) NULL,
    `description` VARCHAR(500) NULL,
    `followersCount` INT(11) NULL,
    `friendsCount` INT(11) NULL,
    `location` VARCHAR(500) NULL,
    `name` VARCHAR(500) NULL,
    `normalFollowersCount` INT(11) NULL,
    `profileBannerUrl` TEXT NULL,
    `profileImageUrlHttps` TEXT NULL,
    `screenName` VARCHAR(500) NULL,
    `postCount` INT(11) NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;
