/* eslint-disable linebreak-style */
module.exports = {
    name: 'pause',
    description: 'Pauses the Player.',
    guildOnly: false,
    args: false,
    usage: '',
    execute: async (message, args, client) => {
        if (!message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')], allowedMentions: { repliedUser: false } });
        const MusicDispatcher = client.queue.get(message.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await message.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (MusicDispatcher.player.connection.channelId !== message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')], allowedMentions: { repliedUser: false } });
        try {
            if (MusicDispatcher.player.paused) return message.reply({ embeds: [client.util.embed().setDescription('Player is Already Paused')], allowedMentions: { repliedUser: false } });
            await MusicDispatcher.pause();
            message.react('⏸️').catch(e => e);
        } catch (error) {
            message.channel.send(`${error.message}`);
        }
    }
};