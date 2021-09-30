/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const { mongoose_uri } = require('./config/config.json'), chalk = require('chalk');

module.exports = async () => {
    await mongoose.connect(mongoose_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose;
};
mongoose.connection.on('connected', () => {
    console.log(chalk.blueBright('DATABASE', 'Connected to database.'));
});