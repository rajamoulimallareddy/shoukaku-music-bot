/* eslint-disable linebreak-style */
const { progress } = require('oxy-progress-bar1');
module.exports = {
    name: 'nowplaying',
    description: 'Shows Currently playing Song',
    execute: async ({ interaction, client }) => {
        if (!interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')] });
        const MusicDispatcher = client.queue.get(interaction.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')] });
        if (MusicDispatcher.player.connection.channelId !== interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')] });
        try {
            if (MusicDispatcher.current.info.title.length > 64) MusicDispatcher.current.info.title = `${MusicDispatcher.current.info.title.split('[').join('[').split(']').join(']').substr(0, 64)}...`;
            var total = MusicDispatcher.current.info.length;
            var current = MusicDispatcher.player.position;
            var slider = '🔵', bar = '▬', size = 20;
            const completed = await Math.floor((current / 1000 % 60)).toString();
            interaction.reply({
                embeds: [client.util.embed()
                    .setDescription(`[${MusicDispatcher.current.info.title}](${MusicDispatcher.current.info.uri}) [${MusicDispatcher.current.info.requester}]`)
                    .setFooter(`${progress(bar, current, total, slider, size)[0]} ${completed}s/${require('pretty-ms')(total)}`)]
            });
        } catch (error) {
            interaction.reply(`${error.message}`);
        }
    }
};