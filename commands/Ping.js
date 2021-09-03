/* eslint-disable linebreak-style */
const { stripIndent } = require('common-tags');

module.exports = {
    name: 'ping',
    description: 'Shows Ping',
    guildOnly: false,
    args: false,
    usage: '',
    owneronly: false,
    execute: async (message, args, client) => {
        const msg = await message.reply({ content: 'Pinging...', allowedMentions: { repliedUser: false } });
        let clientStats = stripIndent`
           Gateway Ping : ${Math.round(message.client.ws.ping)}ms
           REST Ping    : ${msg.createdTimestamp - message.createdTimestamp}ms
           `;

        const embed = client.util
            .embed()
            .setAuthor(' |   Pong', message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`\`\`\`nim\n${clientStats}\`\`\``);
        msg.edit({ content: ' ', embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};