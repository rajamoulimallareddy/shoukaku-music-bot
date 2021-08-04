/* eslint-disable linebreak-style */
const chalk = require('chalk');

module.exports = class logger {
    error(error) {
        console.error(error);
    }

    debug(name, content) {
        console.log(chalk.green(`[DEBUG]    => [${name ? name : 'Unknown'}] ${content}`));
    }

    eventDebug(name, content) {
        console.log(`[DEBUG]    => [${name ? name : 'Unknown'}] ${content}`);
    }

    log(name, content) {
        console.log(chalk.green(`[DEBUG]    => [${name}] ${content}`));
    }
};