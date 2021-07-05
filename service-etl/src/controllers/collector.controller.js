const mongoService = require("./../services/mongo.service");
const mysqlDataService = require('./../services/mysql-data.service')
const webSocketService = require('./../services/web-scoket.service')
const cheerio = require('cheerio');

const dataCollector = {
    runCollectorAsync: async function (clientId) {
        try {
            const site = await mongoService.ClientEntity().findById(clientId).exec();
            if (site) {
                const collectionId = await mysqlDataService.insertCollectionAsync(clientId, site['website'], site['fbError'], site['twtError']);
                const facebookDataObject = await this.processFacebookHtmlDataAsync(site['facebookText'], site['fbError']);
                await mysqlDataService.insertFacebookCollectionAsync(collectionId, facebookDataObject);
                const twitterDataObject = this.processTwitterObjectData(site['twitterJson'], site['twtError']);
                await mysqlDataService.insertTwitterCollectionAsync(collectionId, twitterDataObject);
                await mysqlDataService.updateCollectionStatusAsync(collectionId, 'done');
                webSocketService.sendMessage(JSON.stringify({data: 'refresh'}));
                console.log('success')
            }
        } catch (e) {
            console.log(e.message);
        }
    },
    processFacebookHtmlDataAsync: function (page, hasError) {
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
            if (!page || hasError) {
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
    processTwitterObjectData: function (dataObject, hasError) {
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
        if (!dataObject || hasError) {
            return result;
        }
        try {
            const keyMaps = ['created_at', 'description', 'followers_count', 'friends_count', 'location', 'name', 'normal_followers_count', 'profile_banner_url', 'profile_image_url_https', 'screen_name', 'statuses_count'];
            Object.keys(result).forEach((key, index) => {
                try {
                    result[key] = dataObject.data.user['legacy'][keyMaps[index]];
                } catch (e) {}
            });
        } catch (e) {
            return result;
        }
        return result;
    },
};

module.exports = dataCollector;
