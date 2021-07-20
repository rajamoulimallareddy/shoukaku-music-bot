/* eslint-disable linebreak-style */
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const MusicQueue = require('./Structuers/MusicQueue.js'), MusicHandler = require('./Structuers/MusicHandler.js');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = require('./config/config.json');
client.queue = new MusicQueue(client);
client.shoukaku = new MusicHandler(client);
client.util = require('./config/utility.js');

fs.readdir('./events/', (err, files) => {
    const eventHandler = require('./handler/eventHandler.js');
    eventHandler(err, files, client);
});

fs.readdir('./commands/', (err, files) => {
    const commandHandler = require('./handler/commandHandler.js');
    commandHandler(err, files, client);
});

client.login(client.config.token);