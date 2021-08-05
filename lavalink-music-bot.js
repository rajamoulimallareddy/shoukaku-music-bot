/* eslint-disable linebreak-style */
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
    restTimeOffset: 0
});
const MusicQueue = require('./Structuers/MusicQueue.js'), ShoukakuHandler = require('./Structuers/ShoukakuHandler.js'), loggerHandler = require('./handler/Shoukakulogger.js');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = require('./config/config.json');
client.queue = new MusicQueue(client);
client.shoukaku = new ShoukakuHandler(client);
client.util = require('./config/utility.js');
client.logger = new loggerHandler();

fs.readdir('./events/', (err, files) => {
    const eventHandler = require('./handler/eventHandler.js');
    eventHandler(err, files, client);
});

fs.readdir('./commands/', (err, files) => {
    const commandHandler = require('./handler/commandHandler.js');
    commandHandler(err, files, client);
});

client.login(client.config.token);
