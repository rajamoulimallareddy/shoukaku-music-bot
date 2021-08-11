/* eslint-disable linebreak-style */
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
const { token } = require('./config/config.json');
const { dev, clientId, guildId } = require('./config/config.json');
console.log('• Loading the commands to refresh');
const commands = [];
for (const directory of readdirSync(`${__dirname}/slashcommands`, { withFileTypes: true })) {
    if (!directory.isDirectory()) continue;
    for (const command of readdirSync(`${__dirname}/slashcommands`, { withFileTypes: true })) {
        if (!command.isFile()) continue;
        const Interaction = require(`${__dirname}/slashcommands/${command.name}`);
        commands.push(new Interaction({}).interactionData);
    }
}
console.log(`• Loaded ${commands.length} slash commands to refresh`);
// as per d.js guide, create a rest client
const rest = new REST({ version: '9' }).setToken(token);
// start the load up process
(async () => {
    try {
        console.log(`• Refreshing client "${clientId}" slash commands. Developer Mode? ${dev}`);
        if (dev) {
            // if dev mode is enabled, refresh commands on guild basis on the id of the guild you provided
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        } else {
            // else refresh globally
            await rest.put(Routes.applicationCommands(clientId), { body: commands });
        }
        console.log(`• Success! Refreshed client "${clientId}" slash commands`);
    } catch (error) {
        console.error(error);
    }
})();
// some part of implementation of interaction code is take from github.com/Deivu/Kongou