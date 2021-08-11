/* eslint-disable linebreak-style */
const { progress } = require('oxy-progress-bar1');
module.exports = {
    name: 'nowplaying',
    description: 'Shows Currently playing Song',
    aliases: ['np'],
    guildOnly: false,
    args: false,
    usage: '',
    owneronly: false,
    execute: async (message, args, client) => {
        if (!message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')], allowedMentions: { repliedUser: false } });
        const MusicDispatcher = client.queue.get(message.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await message.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (MusicDispatcher.player.connection.channelId !== message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')], allowedMentions: { repliedUser: false } });
        try {
            if (MusicDispatcher.current.info.title.length > 64) MusicDispatcher.current.info.title = `${MusicDispatcher.current.info.title.split('[').join('[').split(']').join(']').substr(0, 64)}...`;
            var total = MusicDispatcher.current.info.length;
            var current = MusicDispatcher.player.position;
            var slider = '🔵', bar = '▬', size = 20;
            const completed = await Math.floor(current / 1000 % 60).toString();
            message.channel.send({
                embeds: [client.util.embed()
                    .setDescription(`[${MusicDispatcher.current.info.title}](${MusicDispatcher.current.info.uri}) [${MusicDispatcher.current.info.requester}]`)
                    .setFooter(`${progress(bar, current, total, slider, size)[0]} ${completed}s/${require('pretty-ms')(total)}`)]
            });
        } catch (error) {
            message.channel.send(`${error.message}`);
        }
    }
};