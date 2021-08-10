/* eslint-disable linebreak-style */
const { splitBar } = require('string-progressbar');
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
            var stream = MusicDispatcher.current.info.isStream;
            var info = MusicDispatcher.current.info;
            const totalTime = stream ? null : !info || !total || isNaN(total) ? null : total;
            const currentTime = !current || isNaN(current) ? null : current;
            var slider = '🔵', line = '▬';
            const completed = await Math.floor(current / 1000 % 60).toString();
            interaction.reply({
                embeds: [client.util.embed()
                    .setDescription(`[${MusicDispatcher.current.info.title}](${MusicDispatcher.current.info.uri}) [${MusicDispatcher.current.info.requester}]`)
                    .setFooter(`${splitBar(totalTime ? totalTime : 4, currentTime ? currentTime : 4, 20, line, slider)[0]} ${completed}s/${require('pretty-ms')(totalTime)}`)]
            });
        } catch (error) {
            interaction.reply(`${error.message}`);
        }
    }
};