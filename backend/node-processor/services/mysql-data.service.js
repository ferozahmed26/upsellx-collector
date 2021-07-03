const cheerio = require('cheerio'),
    mysql = require('mysql');
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
    insertCollectionAsync: function (refId, website) {
        return new Promise((resolve, reject) => {
            const queryString = `INSERT INTO collections SET ref_id = ?, website = ?, status = ?`;
            const values = [refId, website, 'processing'];
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
    },
    processFacebookHtmlDataAsync: function (page) {
        const result = {
            title: '',
            subTitle: '',
            starCount: '',
            likeCount: '',
            followersCount: '',
            checkInCount: '',
            location: '',
            phone: '',
            website: ''
        };
        return new Promise((resolve, reject) => {
            if (!page) {
                resolve(result);
            }
            try {
                const $ = cheerio.load(page);
                const childrenNodes = $('#PagesProfileHomeSecondaryColumnPagelet').find('._1xnd').children();
                result['title'] = $("meta[property='og:title']").attr('content');
                result['subTitle'] = $('#seo_h1_tag div').text();
                result['starCount'] = $('.uiStars').prev().text();
                const communityNodes = $(childrenNodes[0]).find('._4bl9');
                const aboutNodes = $(childrenNodes[1]);
                const pageTransparency = $(childrenNodes[2]);
                result['likeCount'] = communityNodes.find('div:contains("like")').text().replace(/\D/g, '');
                result['followersCount'] = communityNodes.find('div:contains("follow")').text().replace(/\D/g, '');
                result['checkInCount'] = communityNodes.find('div:contains("check-in")').text().replace(/\D/g, '');
                result['location'] = $(aboutNodes.find('div._4bl9:contains("Direction")').children()[0]).text();
                const phoneNode = aboutNodes.find('._4bl9').toArray().map(m => $(m)).filter(m => m.children().length === 1).filter(l => l.children().children().length === 0)
                result['phone'] = phoneNode.length ? phoneNode[0].text() : '';
                result['website'] = aboutNodes.find('div._v0m').text();
                resolve(result);
            } catch (e) {
                resolve(result);
            }
        })
    },
    processTwitterObjectData: function (dataObject) {
        const result = {
            'pageCreated': '',
            'description': '',
            'followersCount': 0,
            'friendsCount': 0,
            'location': '',
            'name': '',
            'normalFollowersCount': 0,
            'profileBannerUrl': '',
            'profileImageUrlHttps': '',
            'screenName': '',
            'postCount': 0
        };
        if (!dataObject) {
            return result;
        }
        try {
            const keyMaps = ['created_at', 'description', 'followers_count', 'friends_count', 'location', 'name', 'normal_followers_count', 'profile_banner_url', 'profile_image_url_https', 'screen_name', 'statuses_count'];
            Object.keys(result).forEach((key, index) => {
                try {
                    result[key] = dataObject.data.user['legacy'][keyMaps[index]];
                } catch (e) {}
            });
        } catch (e) {}
        return result;
    },
};

module.exports = mysqlDataService;
