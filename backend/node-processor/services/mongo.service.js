const mongoose = require("mongoose"),
    ClientEntity = require('./../models/client-entity');
mongoose.Promise = global.Promise;

mongoService = {
    db: mongoose,
    ClientEntity: function () {
        return this.db.model('Client', ClientEntity);
    },
    findByHost: function (host) {
        return this.ClientEntity().findOne({website: host});
    },
    saveClient: function (website, websiteText, facebookText, twitterJson) {
        const clientModel = new(this.ClientEntity());
        clientModel.website = website;
        clientModel.websiteText = websiteText;
        clientModel.facebookText = facebookText;
        clientModel.twitterJson = twitterJson;
        return clientModel.save();
    }
}

module.exports = mongoService;
