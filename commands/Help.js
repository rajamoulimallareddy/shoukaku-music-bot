/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const { colors } = require('../config/config.json');
const embedColor = colors.default;

module.exports = {
    name: 'help',
    description: 'Get help on how to use the bot and the specific commands',
    aliases: ['?', 'h'],
    guildOnly: false,
    args: false,
    usage: '[command name]',
    execute: async (message, args, client) => {
        const { commands } = message.client;

        const prefix = message.guild.prefix;
        if (!args.length) {
            const cmdHelpEmbed = client.util.embed()
                .setAuthor('HELP')
                .setDescription(
                    `Command list: \n\`${commands
                        .map((command) => command.name)
                        .join(
                            ' | ',
                        )}\``,
                )
                .setColor(embedColor)
                .setFooter(`You can use ${prefix}help {command name} to get info about a specific command!`);
            return message.reply({ embeds: [cmdHelpEmbed], allowedMentions: { repliedUser: false } });
        }

        const name = args[0].toLowerCase();
        const command =
            commands.get(name) ||
            commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));
        if (command.owneronly) return;
        if (!command) {
            return message.reply({
                embeds: [client.util.embed()
                    .setDescription(' |  I couldn\'t find that command')], allowedMentions: { repliedUser: false }
            });
        }
        const cmdHelpEmbed = client.util.embed()
            .setTitle(`Command info | ${command.name}`)
            .setDescription(command.description)
            .addField(
                'Usage',
                `\`${prefix + command.name} ${command.usage}\``,
                true,
            )
            .setColor(embedColor);

        if (command.aliases) {
            cmdHelpEmbed.addField(
                'Aliases',
                `\`${command.aliases.join(' | ')}\``,
                true,
            );
        }

        return message.reply({ embeds: [cmdHelpEmbed], allowedMentions: { repliedUser: false } });

    },
};