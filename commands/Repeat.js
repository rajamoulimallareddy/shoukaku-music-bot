/* eslint-disable linebreak-style */
module.exports = {
    name: 'loop',
    description: 'set repeat',
    guildOnly: false,
    args: false,
    usage: '',
    owneronly: false,
    execute: async (message, args, client) => {
        try {
            if (!message.member.voice.channelId)
                return message.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')], allowedMentions: { repliedUser: false } });
            const MusicDispatcher = client.queue.get(message.guild.id);
            if (!MusicDispatcher || !MusicDispatcher.current)
                return message.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')], allowedMentions: { repliedUser: false } });
            if (MusicDispatcher.player.connection.channelId !== message.member.voice.channelId)
                return message.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')], allowedMentions: { repliedUser: false } });
            if (MusicDispatcher.repeat === 0) {
                MusicDispatcher.repeat = 1;
                return message.reply({ embeds: [client.util.embed().setDescription('I have set repeat to track.')], allowedMentions: { repliedUser: false } });
            } else if (MusicDispatcher.repeat === 1) {
                MusicDispatcher.repeat = 2;
                return message.reply({ embeds: [client.util.embed().setDescription('I have set repeat to queue.')], allowedMentions: { repliedUser: false } });
            } else if (MusicDispatcher.repeat === 2) {
                MusicDispatcher.repeat = 0;
                return message.reply({ embeds: [client.util.embed().setDescription('I have disabled the repeat.')], allowedMentions: { repliedUser: false } });
            }
        } catch (error) {
            message.channel.send(`${error.message}`);
        }
    }
};