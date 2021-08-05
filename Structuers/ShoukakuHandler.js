/* eslint-disable linebreak-style */
const { Shoukaku, Libraries } = require('shoukaku');
const chalk = require('chalk');
const config = require('../config/config.json');
const LavalinkServers = config.nodes;
const shoukakuOptions = {
    moveOnDisconnect: false,
    resumable: false,
    resumableTimeout: 30,
    reconnectTries: 2,
    restTimeout: 10000
};

class ShoukakuHandler extends Shoukaku {

    constructor(client) {
        super(new Libraries.DiscordJS(client), LavalinkServers, shoukakuOptions);

        this.on('ready', (name, resumed) =>
            client.logger.log(chalk.green(`LAVALINK => [STATUS] ${name} successfully connected.`, `This connection is ${resumed ? 'resumed' : 'a new connection'}`))
        );

        this.on('error', (name, error) =>
            client.logger.error(chalk.red(`LAVALINK => ${name}: Error Caught.`, error))
        );

        this.on('close', (name, code, reason) =>
            client.logger.log(chalk.redBright(`LAVALINK => ${name}: Closed, Code ${code}`, `Reason ${reason || 'No reason'}.`))
        );

        this.on('disconnect', (name, players, moved) =>
            client.logger.log(chalk.yellowBright(`LAVALINK => ${name}: Disconnected`, moved ? 'players have been moved' : 'players have been disconnected'))
        );

        this.on('debug', (name, reason) =>
            client.logger.log(chalk.yellowBright`LAVALINK => ${name}`, reason || 'No reason')
        );
    }
}

module.exports = ShoukakuHandler;