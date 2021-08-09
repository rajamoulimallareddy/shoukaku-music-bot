/* eslint-disable linebreak-style */
module.exports = {
    name: 'source',
    description: 'Gives invite of the bot support/github/bots invite link',
    execute: async ({ interaction, client }) => {
        interaction.reply({ embeds: [client.util.embed().setDescription(`❱・[Source Code](https://github.com/rajamoulimallareddy/shoukaku-music-bot)\n❱・[Support Server](https://discord.gg/dB6RzCbZhW)\n❱・ [Invite Me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`)] });
    }
};
