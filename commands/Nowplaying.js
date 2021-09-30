/* eslint-disable linebreak-style */
const { progress } = require('oxy-progress-bar1');
module.exports = {
    name: 'nowplaying',
    description: 'Shows Currently playing Song',
    aliases: ['np'],
    guildOnly: false,
    args: false,
    usage: 'nowplaying',
    owneronly: false,
    execute: async (message, args, client) => {
        if (!message.member.voice.channelId)
            return message.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')], allowedMentions: { repliedUser: false } });
        const MusicDispatcher = client.queue.get(message.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return message.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (MusicDispatcher.player.connection.channelId !== message.member.voice.channelId)
            return message.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')], allowedMentions: { repliedUser: false } });
        try {
            let total = MusicDispatcher.current.info.length;
            let current = MusicDispatcher.player.position;
            let slider = '🔵', bar = '▬', size = 20;
            message.reply({
                embeds: [client.util.embed()
                    .setDescription(`[${MusicDispatcher.current.info.title}](${MusicDispatcher.current.info.uri}) [${MusicDispatcher.current.info.requester}]`)
                    .setFooter(`${progress(bar, current, total, slider, size)[0]} ${require('pretty-ms')(current)}/${require('pretty-ms')(total)}`)]
            });
        } catch (error) {
            message.channel.send(`${error.message}`);
        }
    }
};