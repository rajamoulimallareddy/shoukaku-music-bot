/* eslint-disable linebreak-style */
module.exports = {
    name: 'skip',
    description: 'skips currently playing track',
    execute: async ({ interaction, client }) => {
        if (!interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')] });
        const MusicDispatcher = client.queue.get(interaction.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')] });
        if (MusicDispatcher.player.connection.channelId !== interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')] });
        try {
            await MusicDispatcher.skip();
            interaction.reply({ embeds: [client.util.embed().setDescription('Skipped the song')] });
        } catch (error) {
            interaction.reply(`${error.message}`);
        }
    }
};