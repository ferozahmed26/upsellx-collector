const got = require('got'),
    cheerio = require('cheerio'),
    config = require('./../config/app.config')(),
    senderRMQ = require('./../services/amqp.sender'),
    facebookSpider = require('./facebook-spider.controller'),
    twitterSpider = require('./twitter-spider.controller'),
    mongoService = require("../services/mongo.service");

const webSpider = {
    pageHtml: '',
    runSpiderAsync: async function (req, res, next) {
        const data = req.body;
        try {
            if (!data.hasOwnProperty('site')) {
                throw new Error('Site should not empty.');
            } else if(!_nValidURL(data.site)) {
                throw new Error('Not a valid site.');
            }
            const hostName = _nGetUrlObject(data.site).hostname.replace('www.', '');
            let site = await mongoService.findByHost(hostName);
            /*console.log(site._id);
            return res.json(site);*/
            if (site) {
                throw new Error('Site already exist.');
            }
            const pageHtml = await this.getPageAsync(data.site);
            const links = await this.getSocialLinks(pageHtml);
            let facebookPageHtml = '';
            let fbError = false;
            if (links['facebook']) {
                try {
                    facebookPageHtml = await facebookSpider.getPageAsync(links['facebook']);
                } catch (e) {
                    fbError = true;
                }
            }
            let clientJson = null;
            let twtError = false;
            if (links['twitter']) {
                try {
                    clientJson = await twitterSpider.scrapData(links['twitter']);
                } catch (e) {
                    twtError = true;
                }
            }
            site = await mongoService.saveClient(hostName, pageHtml, facebookPageHtml, clientJson, fbError, twtError);
            console.log(site._id);
            await senderRMQ.connect(config.rabbit.host, config.rabbit.port)
            senderRMQ.send(site['_id'].toString());
            res.json({
                message: 'Successful',
                id: site._id
            });
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    },
    getPageAsync: function (page) {
        page = _nAddHttpPrefix(page);
        return new Promise((resolve, reject) => {
            got(`${page}`)
                .then(response => {
                    const pageHtml = response.body;
                    resolve(pageHtml)
                })
                .catch(error => reject(error));
        })
    },
    getSocialLinks: function (pageHtml) {
        return new Promise((resolve, reject) => {
            const $ = cheerio.load(pageHtml);
            const result = {facebook: '', twitter: ''};
            const fb = $("a[href*='facebook.com']");
            const twt = $("a[href*='twitter.com']");
            if (fb.attr('href')) {
                result.facebook = fb.attr('href');
            }
            if (twt.attr('href')) {
                result.twitter = twt.attr('href');
            }
            resolve(result)
        });
    }
};

module.exports = webSpider;
