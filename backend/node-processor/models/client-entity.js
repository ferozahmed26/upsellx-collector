const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ClientEntity = new Schema ({
        status: String,
        website: String,
        websiteText: String,
        facebookText: String,
        twitterJson: Object,
    },
    { timestamps: true }
);
module.exports = ClientEntity;
