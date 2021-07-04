const mysql = require('mysql');
mysqlDataService = {
    pool: null,
    connect: function (host, port, user, password, db) {
        const that = this;
        return new Promise(resolve => {
            that.pool  = mysql.createPool({
                connectionLimit : 10,
                host            : host,
                user            : user,
                password        : password,
                database        : db
            });
            resolve();
        });
    },
    getCollectionList: function (collectionId, status) {
        return new Promise((resolve, reject) => {
            const queryString = `SELECT
                                    c.id,
                                    c.ref_id,
                                    c.website,
                                    c.status,
                                    c.fbError,
                                    c.twtError,
                                    c.createdAt,
                                    c.updatedAt,
                                    fc.title fb_title,
                                    fc.subTitle fb_subTitle,
                                    fc.starCount fb_starCount,
                                    fc.likeCount fb_likeCount,
                                    fc.followersCount fb_followersCount,
                                    fc.checkInCount fb_checkInCount,
                                    fc.location fb_location,
                                    fc.phone fb_phone,
                                    fc.website fb_website,
                                    fc.pageCreated fb_pageCreated,
                                    tc.pageCreated twt_pageCreated,
                                    tc.description twt_description,
                                    tc.followersCount twt_followersCount,
                                    tc.friendsCount twt_friendsCount,
                                    tc.location twt_location,
                                    tc.name twt_name,
                                    tc.normalFollowersCount twt_normalFollowersCount,
                                    tc.profileBannerUrl twt_profileBannerUrl,
                                    tc.profileImageUrlHttps twt_profileImageUrlHttps,
                                    tc.screenName twt_screenName,
                                    tc.postCount twt_postCount
                                FROM
                                    collections c
                                LEFT JOIN facebook_collections fc ON
                                    c.id = fc.collection_id
                                LEFT JOIN twitter_collections tc ON
                                    c.id = tc.collection_id`;
            this.pool.query(queryString, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    twitterFields: [
        'pageCreated',
        'description',
        'followersCount',
        'friendsCount',
        'location',
        'name',
        'normalFollowersCount',
        'profileBannerUrl',
        'profileImageUrlHttps',
        'screenName',
        'postCount'
    ],
    facebookFields: [
        'title',
        'subTitle',
        'starCount',
        'likeCount',
        'followersCount',
        'checkInCount',
        'location',
        'phone',
        'website'
    ]
};

module.exports = mysqlDataService;
