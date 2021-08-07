/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const PrefixSchema = mongoose.Schema({
    ID: String,
    PREFIX: String,
});

module.exports = mongoose.model('PREFIX', PrefixSchema);