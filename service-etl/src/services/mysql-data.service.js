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
    insertCollectionAsync: function (refId, website, fbError, twtError) {
        return new Promise((resolve, reject) => {
            fbError = fbError ? '1' : '0';
            twtError = twtError ? '1' : '0';
            const queryString = `INSERT INTO collections SET ref_id = ?, website = ?, status = ?, fbError = ?, twtError = ?`;
            const values = [refId, website, 'processing', fbError, twtError];
            this.pool.query(queryString, values, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    },
    updateCollectionStatusAsync: function (collectionId, status) {
        return new Promise((resolve, reject) => {
            const queryString = `UPDATE collections SET status = ? WHERE id = ?`;
            const values = [status, collectionId];
            this.pool.query(queryString, values, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    },
    insertFacebookCollectionAsync: function (collectionId, facebookDataObject) {
        return new Promise((resolve, reject) => {
            const queryString = `INSERT INTO facebook_collections SET collection_id = ?, title = ?, subTitle = ?, starCount = ?, likeCount = ?, followersCount = ?, checkInCount = ?, location = ?, phone = ?, website = ?`;
            const values = [collectionId, ...Object.values(facebookDataObject)];
            this.pool.query(queryString, values, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    },
    insertTwitterCollectionAsync: function (collectionId, twitterDataObject) {
        return new Promise((resolve, reject) => {
            const queryString = `INSERT INTO twitter_collections SET collection_id = ?, pageCreated = ?, description = ?, followersCount = ?, friendsCount = ?, location = ?, name = ?, normalFollowersCount = ?, profileBannerUrl = ?, profileImageUrlHttps = ?, screenName = ?, postCount = ?`;
            const values = [collectionId, ...Object.values(twitterDataObject)];
            this.pool.query(queryString, values, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    }
};

module.exports = mysqlDataService;
