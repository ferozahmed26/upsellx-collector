const mongoose = require("mongoose"),
    ClientEntity = require('./../models/client-entity');
mongoose.Promise = global.Promise;

mongoService = {
    db: mongoose,
    ClientEntity: function () {
        return this.db.model('Client', ClientEntity);
    },
    findByHost: function (host) {
        return this.ClientEntity().findOne({website: host}).exec();
    },
    saveClient: function (website, websiteText, facebookText, twitterJson, fbError, twtError) {
        const clientModel = new(this.ClientEntity());
        clientModel.status = 'stored';
        clientModel.website = website;
        clientModel.websiteText = websiteText;
        clientModel.facebookText = facebookText;
        clientModel.twitterJson = twitterJson;
        clientModel.fbError = fbError;
        clientModel.twtError = twtError;
        return clientModel.save();
    }
}

module.exports = mongoService;
