const got = require('got');

const facebookSpider = {
    getPageAsync: function (page) {
        const profile = page.split('facebook.com/')[1].trim().replace('/', '');
        return new Promise((resolve, reject) => {
            got(`https://facebook.com/${profile}`)
                .then(response => {
                    const pageHtml = response.body;
                    resolve(pageHtml)
                })
                .catch(error => reject(error));
        })
    }
};

module.exports = facebookSpider;
