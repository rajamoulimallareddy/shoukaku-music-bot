/* eslint-disable linebreak-style */
module.exports = {
    name: 'seek',
    description: 'seeks to a specific time',
    aliases: [''],
    guildOnly: false,
    args: false,
    usage: '[seconds]',
    owneronly: false,
    execute: async (message, args, client) => {
        if (!message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')], allowedMentions: { repliedUser: false } });
        const MusicDispatcher = client.queue.get(message.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await message.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (MusicDispatcher.player.connection.channelId !== message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (!MusicDispatcher.current.info.isSeekable)
            return message.channel.send({ embeds: [client.util.embed().setDescription('Current track isn\'t seekable.')], allowedMentions: { repliedUser: false } });
        const duration = args[0];
        if (!duration && !isNaN(duration)) {
            return message.channel.send({ embeds: [client.util.embed().setDescription('You must provide a time format to seek')], allowedMentions: { repliedUser: false } });
        } else if (duration && isNaN(duration)) {
            return message.channel.send({ embeds: [client.util.embed().setDescription('Wrong Usage E.g., seek<seconds>')], allowedMentions: { repliedUser: false } });
        }

        const durationMs = client.util.durationToMillis(duration);
        if (durationMs > MusicDispatcher.current.info.length)
            return message.channel.send({ embeds: [client.util.embed().setDescription('The duration you provide exceeds the duration of the current track')], allowedMentions: { repliedUser: false } });

        try {
            await MusicDispatcher.player.seekTo(duration * 1000);
            message.channel.send({ embeds: [client.util.embed().setDescription(`Seeked to ${client.util.millisToDuration(durationMs)}.`)], allowedMentions: { repliedUser: false } });
        } catch (err) {
            message.channel.send(`${err.message}`);
        }

    }
};
