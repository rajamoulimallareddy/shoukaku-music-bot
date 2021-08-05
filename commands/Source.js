/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
module.exports = {
    name: 'source',
    description: 'Gives invite of the bot support/github link',
    aliases: [],
    guildOnly: false,
    args: false,
    execute: async (message, args, client) => {
        message.reply({ embeds: [client.util.embed().setDescription('❱・[Source Code](https://github.com/rajamoulimallareddy/shoukaku-music-bot)\n❱・[Support Server](https://discord.gg/dB6RzCbZhW)')], allowedMentions: { repliedUser: false } });
    }
};
