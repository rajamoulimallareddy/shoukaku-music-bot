/* eslint-disable linebreak-style */
module.exports = {
    name: 'previous',
    description: 'Skips to previous song.',
    aliases: ['moveback'],
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
            if (!MusicDispatcher.previous) return message.channel.send({ embeds: [client.util.embed().setDescription('There Is No Previous Track To Play')], allowedMentions: { repliedUser: false } });
            MusicDispatcher.queue.unshift(MusicDispatcher.previous);
            await MusicDispatcher.skip();
            message.reply({ embeds: [client.util.embed().setDescription(`Skipped To Previous Song [${MusicDispatcher.previous.info.title}](${MusicDispatcher.previous.info.uri}) - [${MusicDispatcher.previous.info.requester}]`)], allowedMentions: { repliedUser: false } });
            message.react('🔙').catch(e => e);
        } catch (error) {
            message.channel.send(`${error.message}`);
        }
    }
};
