/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const chalk = require('chalk');

module.exports = {
    event: 'ready',
    once: true,
    run(client) {
        console.log(chalk.green(`[CLIENT]   => [READY]               [${client.user.tag}]`));
    },
};