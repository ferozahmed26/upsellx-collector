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
            const queryString = `SELECT * FROM collections`;
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
