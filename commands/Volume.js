/* eslint-disable linebreak-style */
module.exports = {
    name: 'volume',
    description: 'Sets current Play back volume of the player.',
    aliases: ['vol'],
    guildOnly: false,
    args: false,
    usage: '[0-500]',
    execute: async (message, args, client) => {
        const newVolume = Number(args[0]);
        if (!message.member.voice.channelId)
            return message.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')], allowedMentions: { repliedUser: false } });
        const MusicDispatcher = client.queue.get(message.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return message.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (MusicDispatcher.player.connection.channelId !== message.member.voice.channelId)
            return message.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')], allowedMentions: { repliedUser: false } });

        try {
            if (isNaN(newVolume)) {
                message.reply({ embeds: [client.util.embed().setDescription(`Current volume: \`${MusicDispatcher.player.filters.volume * 100}\``)], allowedMentions: { repliedUser: false } });
            } else {
                if (newVolume < 0 || newVolume > 500 || !isNaN(newVolume))
                    return message.reply({ embeds: [client.util.embed().setDescription('You can only set the volume from 0-500.')], allowedMentions: { repliedUser: false } });
                await MusicDispatcher.player.setVolume(newVolume / 100);
                message.reply({ embeds: [client.util.embed().setDescription(`The playback volume is now set to: \`${newVolume}\``)], allowedMentions: { repliedUser: false } });
            }
        } catch (error) {
            message.channel.send(`${error.message}`);
        }
    }
};