const mongoose = require('mongoose');
const addresses = mongoose.Schema({
    browserid: {
        type: String,
        required: true,
    },
    browserport: {
        type: String,
        required: true,
    },
    postdataurl: {
        type: String,
        required: true
    }
});
const address = mongoose.model('address',addresses);
module.exports = address;