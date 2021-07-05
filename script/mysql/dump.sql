CREATE DATABASE IF NOT EXISTS `upsellx`;
CREATE TABLE IF NOT EXISTS `upsellx`.`collections`(
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
CREATE TABLE IF NOT EXISTS `upsellx`.`facebook_collections`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `collection_id` INT(11) NOT NULL,
    `title` VARCHAR(500) NULL,
    `subTitle` VARCHAR(500) NULL,
    `starCount` VARCHAR(100) NULL,
    `likeCount` VARCHAR(100) NULL,
    `followersCount` VARCHAR(100) NULL,
    `checkInCount` VARCHAR(100) NULL,
    `location` VARCHAR(500) NULL,
    `phone` VARCHAR(100) NULL,
    `website` VARCHAR(500) NULL,
    `pageCreated` VARCHAR(100) NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `upsellx`.`twitter_collections`(
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
