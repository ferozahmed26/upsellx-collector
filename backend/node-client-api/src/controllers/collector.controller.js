const mysqlDataService = require('./../services/mysql-data.service')
const dataCollector = {
    clientList: async function (req, res, next) {
        try {
            const list = await mysqlDataService.getCollectionList();
            res.json(list);
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
};

module.exports = dataCollector;
