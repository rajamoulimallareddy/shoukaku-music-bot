/* eslint-disable linebreak-style */
module.exports = {
    name: 'resume',
    description: 'Resumes the paused Player.',
    execute: async ({ interaction, client }) => {
        if (!interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')] });
        const MusicDispatcher = client.queue.get(interaction.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')] });
        if (MusicDispatcher.player.connection.channelId !== interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')] });
        try {
            if (MusicDispatcher.player.paused) return interaction.reply({ embeds: [client.util.embed().setDescription('Player is Already Paused')] });
            await MusicDispatcher.pause();
            interaction.reply({ embeds: [client.util.embed().setDescription('Player Is Now Paused')] });
        } catch (err) {
            console.log(err.message);
        }
    }
};