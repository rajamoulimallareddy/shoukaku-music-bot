/* eslint-disable linebreak-style */
const { stripIndent } = require('common-tags');

module.exports = {
    name: 'ping',
    description: 'shows bot ping',
    execute: async ({ interaction, client }) => {
        const m = await interaction.deferReply({ fetchReply: true });
        interaction.editReply('Pinging...');
        let clientStats = stripIndent`
           Gateway Ping : ${Math.round(client.ws.ping)}ms
           REST Ping    : ${m.createdTimestamp - interaction.createdTimestamp}ms
           `;
        const embed = client.util
            .embed()
            .setAuthor(' |   Pong', interaction.member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`\`\`\`nim\n${clientStats}\`\`\``);
        interaction.editReply({ content: ' ', embeds: [embed] });
    }
};