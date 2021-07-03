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
            await this.getPageAsync(data.site);
            const links = await this.getSocialLinks();
            if (links['facebook']) {
                await facebookSpider.getPageAsync(links['facebook']);
            }
            if (links['twitter']) {
                await twitterSpider.scrapData(links['twitter']);
            }
            site = await mongoService.saveClient(hostName, this.pageHtml, facebookSpider.pageHtml, twitterSpider.clientJson);
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
                    this.pageHtml = response.body;
                    resolve('result')
                })
                .catch(error => reject(error));
        })
    },
    getSocialLinks: function () {
        return new Promise((resolve, reject) => {
            const $ = cheerio.load(this.pageHtml);
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
    },
    savePageAsync: function () {
        return new Promise((resolve, reject) => resolve(this.pageHtml));
    }
};

module.exports = webSpider;
