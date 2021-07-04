const mongoService = require("./../services/mongo.service");
const mysqlDataService = require('./../services/mysql-data.service')
const dataCollector = {
    runCollectorAsync: async function (clientId) {
        try {
            const site = await mongoService.ClientEntity().findById(clientId).exec();
            if (site) {
                const collectionId = await mysqlDataService.insertCollectionAsync(clientId, site['website'], site['fbError'], site['twtError']);
                const facebookDataObject = await mysqlDataService.processFacebookHtmlDataAsync(site['facebookText'], site['fbError']);
                await mysqlDataService.insertFacebookCollectionAsync(collectionId, facebookDataObject);
                const twitterDataObject = mysqlDataService.processTwitterObjectData(site['twitterJson'], site['twtError']);
                await mysqlDataService.insertTwitterCollectionAsync(collectionId, twitterDataObject);
                await mysqlDataService.updateCollectionStatusAsync(collectionId, 'done');
                console.log('success')
            }
        } catch (e) {
            console.log(e.message);
        }
    }
};

module.exports = dataCollector;
