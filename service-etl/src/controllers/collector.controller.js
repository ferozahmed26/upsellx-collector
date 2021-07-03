const mongoService = require("./../services/mongo.service");
const mysqlDataService = require('./../services/mysql-data.service')
const dataCollector = {
    runCollectorAsync: async function (clientId) {
        try {
            const site = await mongoService.ClientEntity().findById(clientId);
            if (site) {
                const collectionId = await mysqlDataService.insertCollectionAsync(clientId, site['website']);
                const facebookDataObject = await mysqlDataService.processFacebookHtmlDataAsync(site['facebookText']);
                await mysqlDataService.insertFacebookCollectionAsync(collectionId, facebookDataObject);
                const twitterDataObject = mysqlDataService.processTwitterObjectData(site['twitterJson']);
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
