const got = require('got');

const facebookSpider = {
    pageHtml: '',
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
    },
    savePage: function () {
        return new Promise((resolve, reject) => resolve(this.pageHtml));
    }
};

module.exports = facebookSpider;
