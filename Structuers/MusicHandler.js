/* eslint-disable linebreak-style */
const { Shoukaku } = require('shoukaku');
const config = require('../config/config.json');
const LavalinkServers = config.nodes;
const shoukakuOptions = {
    moveOnDisconnect: false,
    resumable: false,
    resumableTimeout: 30,
    reconnectTries: 2,
    restTimeout: 10000
};

class MusicHandler extends Shoukaku {
    constructor(client) {
        super(client, LavalinkServers, shoukakuOptions);

        this.on('ready', (name) => console.log(`Lavalink ${name}: Ready!`));
        this.on('error', (name, error) => console.error(`Lavalink ${name}: Error Caught,`, error));
        this.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`));
        this.on('disconnected', (name, reason) => console.warn(`Lavalink ${name}: Disconnected, Reason ${reason || 'No reason'}`));
    }
}

module.exports = MusicHandler;