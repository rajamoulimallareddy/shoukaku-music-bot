/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const chalk = require('chalk');

module.exports = {
    event: 'ready',
    once: true,
    async run(client) {
        console.log(chalk.green(`[CLIENT]   => [READY]               [${client.user.tag}]`));
        if (!client.application?.owner) await client.application?.fetch();
        const commands = client.slashs.map(command => ({
            name: command.name,
            description: command.description,
            options: command.options,
        }));
        if (!client.config.guildId) {
            // global command 
            await client.application?.commands.set(commands);
            client.logger.debug('slash', `Updated ${client.slashs.size} interaction command(s)  global`);
        } else {
            // guild specific command for testing
            await client.guilds.cache.get(client.config.guildId)?.commands.set(commands);
            client.logger.debug('slash', `Updated ${client.slashs.size} interaction command(s) `);
        }
    },
};