/* eslint-disable linebreak-style */
const { stripIndent } = require('common-tags');

module.exports = {
    name: 'ping',
    description: 'Shows Ping',
    aliases: [],
    guildOnly: false,
    args: false,
    usage: '',
    ownerOnly: true,
    execute: async (message, args, client) => {
        const m = await message.reply({ content: 'Pinging...', allowedMentions: { repliedUser: false } });
        const gtp = Math.round(message.client.ws.ping);

        let clientStats = stripIndent`
           Gateway Ping : ${gtp}ms
           REST Ping    : ${m.createdTimestamp - message.createdTimestamp}ms
           `;
        const embed = client.util
            .embed()
            .setAuthor(
                ' |   Pong',
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(`\`\`\`nim\n${clientStats}\`\`\``);
        m.edit({ content: ' ', embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};