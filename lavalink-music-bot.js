/* eslint-disable linebreak-style */
const fs = require('fs');
const { Client, Collection } = require('discord.js');
const client = new Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    intents: ['GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    restTimeOffset: 0
});
const MusicQueue = require('./Structures/MusicQueue.js'), ShoukakuHandler = require('./Structures/ShoukakuHandler.js'), loggerHandler = require('./handler/Shoukakulogger.js');

client.commands = new Collection();
client.aliases = new Collection();
client.slashs = new Collection();
client.logger = new loggerHandler();
client.queue = new MusicQueue(client);
client.shoukaku = new ShoukakuHandler(client);
client.config = require('./config/config.json');
client.util = require('./sturcturesExtends/Utilities.js');

fs.readdir('./events/', (err, files) => {
    const eventHandler = require('./handler/eventHandler.js');
    eventHandler(err, files, client);
});

fs.readdir('./commands/', (err, files) => {
    const commandHandler = require('./handler/commandHandler.js');
    commandHandler(err, files, client);
});

fs.readdir('./slashcommands/', (err, files) => {
    const InteractionHandler = require('./handler/InteractionHandler.js');
    InteractionHandler(err, files, client);
});

require('./mongoose.js')();

process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p);
});

process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err, origin);
});

process.on('multipleResolves', (type, promise, reason) => {
    console.log(type, promise, reason);
});

client.login(client.config.token);