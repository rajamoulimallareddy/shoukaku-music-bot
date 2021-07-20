/* eslint-disable linebreak-style */
module.exports = {
    event: 'message',
    run: (message, client) => {
        if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;
        const args = message.content.slice(client.config.prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
            );
        if (!command) return;
        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.ownerOnly) {
            if (!client.config.owners.includes(message.author.id)) return message.reply('Sorry, this command can only be used by the bot owners.');
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${client.config.prefix}${command.name} ${command.usage}\``;
            }
            return message.channel.send(reply);
        }
        try {
            command.execute(message, args, client);
        }
        catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    },
};