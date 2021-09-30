/* eslint-disable linebreak-style */
module.exports = {
    name: 'previous',
    description: 'Skips to previous song.',
    execute: async ({ interaction, client }) => {
        if (!interaction.member.voice.channelId)
            return interaction.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')] });
        const MusicDispatcher = client.queue.get(interaction.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return interaction.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')] });
        if (MusicDispatcher.player.connection.channelId !== interaction.member.voice.channelId)
            return interaction.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')] });
        try {
            if (!MusicDispatcher.previous) return interaction.reply({ embeds: [client.util.embed().setDescription('There Is No Previous Track To Play')] });
            MusicDispatcher.queue.unshift(MusicDispatcher.previous);
            await MusicDispatcher.skip();
            interaction.reply({ embeds: [client.util.embed().setDescription(`Skipped To Previous Song [${MusicDispatcher.previous.info.title}](${MusicDispatcher.previous.info.uri}) - [${MusicDispatcher.previous.info.requester}]`)] });
        } catch (error) {
            interaction.reply(`${error.message}`);
        }
    }
};
