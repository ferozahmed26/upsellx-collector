const got = require('got');

const twitterSpider = {
    clientJson: '',
    getGuestTokenAsync: function (page) {
        const url = 'https://api.twitter.com/1.1/guest/activate.json';
        return new Promise((resolve, reject) => {
            got.post(url, {
                json: {},
                responseType: 'json',
                headers: {
                    'authorization': this.authorization
                }
            }).then(response => {
                const {guest_token} = response.body;
                resolve(guest_token);
            }).catch(e => reject(e));
        });
    },
    getProfileDataAsync: function (page) {
        const profile = page.split('twitter.com/')[1].trim().replace('/', '');
        const url = encodeURI(`https://twitter.com/i/api/graphql/4ti9aL9m_1Rb-QVTuO5QYw/UserByScreenNameWithoutResults?variables=${JSON.stringify({"screen_name":profile,"withHighlightedLabel":true})}`);
        console.log({
            'authorization': this.authorization,
            'x-guest-token': this.guest_token,
        });
        return new Promise((resolve, reject) => {
            got.post(url, {
                json: {},
                responseType: 'json',
                headers: {
                    'authorization': this.authorization,
                    'x-guest-token': this.guest_token,
                }
            }).then(response => {
                this.clientJson = response.body;
                resolve('done');
            }).catch(e => reject(e));
        });
    },
    scrapData: async function (page) {
        try {
            this.guest_token = await this.getGuestTokenAsync();
            await this.getProfileDataAsync(page);
        } catch (e) {
            throw e;
        }
    },
    guest_token: '',
    authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'
};

module.exports = twitterSpider;
