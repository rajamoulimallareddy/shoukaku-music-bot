/* eslint-disable linebreak-style */
module.exports = {
    name: 'resume',
    description: 'Resumes the paused Player.',
    aliases: [],
    guildOnly: false,
    args: false,
    usage: '',
    execute: async (message, args, client) => {
        if (!message.member.voice.channelID)
            return await message.channel.send(client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED'));
        const MusicDispatcher = client.queue.get(message.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await message.channel.send(client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED'));
        if (MusicDispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID)
            return await message.channel.send(client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED'));
        try {
            if (!MusicDispatcher.player.paused) return message.channel.send(client.util.embed().setDescription('Player is Already Paused'));
            await MusicDispatcher.pause();
            message.react('⏸️').catch(e => e);
        } catch (err) {
            console.log(err.message);
        }
    }
};