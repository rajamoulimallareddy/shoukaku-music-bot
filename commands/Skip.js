/* eslint-disable linebreak-style */
module.exports = {
    name: 'skip',
    description: 'skips a track or skips to specific track in queue.',
    aliases: ['skipto', 'Jump', 'next', 's'],
    guildOnly: false,
    args: false,
    usage: '[number]',
    execute: async (message, args, client) => {
        const skipTo = args[0] ? parseInt(args[0], 10) : null;
        if (!message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')], allowedMentions: { repliedUser: false } });
        const MusicDispatcher = client.queue.get(message.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await message.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (MusicDispatcher.player.connection.channelID !== message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > MusicDispatcher.queue.length)) return message.reply({ embeds: [client.util.embed().setDescription('Number Is Invalid Or Exceeds Queue Length.')], allowedMentions: { repliedUser: false } });
        try {
            await MusicDispatcher.skip(skipTo);
            message.react('👌').catch(e => e);
        } catch (err) {
            console.log(err.message);
        }
    }
};
