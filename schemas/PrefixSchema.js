/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const PrefixSchema = new mongoose.Schema({
    serverId: { type: String },
    prefix: { type: String }
});

module.exports = mongoose.model('PREFIX', PrefixSchema);