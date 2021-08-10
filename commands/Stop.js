/* eslint-disable linebreak-style */
module.exports = {
    name: 'stop',
    description: 'Clears the queue and disconnects from Voice Channel.',
    aliases: ['dc', 'leave'],
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
            await MusicDispatcher.stop();
            message.react('👋').catch(e => e);
        } catch (error) {
            message.channel.send(`${error.message}`);
        }
    }
};