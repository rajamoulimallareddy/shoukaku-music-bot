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
            let total = MusicDispatcher.current.info.length;
            let current = MusicDispatcher.player.position;
            let slider = '🔵', bar = '▬', size = 20;
            interaction.reply({
                embeds: [client.util.embed()
                    .setDescription(`[${MusicDispatcher.current.info.title}](${MusicDispatcher.current.info.uri}) [${MusicDispatcher.current.info.requester}]`)
                    .setFooter(`${progress(bar, current, total, slider, size)[0]} ${require('pretty-ms')(current)}/${require('pretty-ms')(total)}`)]
            });
        } catch (error) {
            interaction.reply(`${error.message}`);
        }
    }
};