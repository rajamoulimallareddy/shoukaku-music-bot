/* eslint-disable linebreak-style */
const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
    restTimeOffset: 0
});
const MusicQueue = require('./Structuers/MusicQueue.js'), ShoukakuHandler = require('./Structuers/ShoukakuHandler.js'), loggerHandler = require('./handler/Shoukakulogger.js');

client.logger = new loggerHandler();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = require('./config/config.json');
client.queue = new MusicQueue(client);
client.shoukaku = new ShoukakuHandler(client);
client.util = require('./config/Utilities.js');
fs.readdir('./events/', (err, files) => {
    const eventHandler = require('./handler/eventHandler.js');
    eventHandler(err, files, client);
});

fs.readdir('./commands/', (err, files) => {
    const commandHandler = require('./handler/commandHandler.js');
    commandHandler(err, files, client);
});


mongoose.connect(client.config.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useFindAndModify: true
}).then(() => {
    client.logger.log('DATABASE', 'Connected to database.');
}).catch(() => {
    client.logger.log('MONGODB URI is either not provided or invalid.');
});

client.login(client.config.token);