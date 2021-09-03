/* eslint-disable linebreak-style */
const Wait = require('util').promisify(setTimeout);
module.exports = {
    name: 'stop',
    description: 'clears the queue and destroys the player',
    execute: async ({ interaction, client }) => {
        await interaction.deferReply();
        if (!interaction.member.voice.channelId)
            return await interaction.editReply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')] });
        const MusicDispatcher = client.queue.get(interaction.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await interaction.editReply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')] });
        if (MusicDispatcher.player.connection.channelId !== interaction.member.voice.channelId)
            return await interaction.editReply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')] });
        try {
            MusicDispatcher.end = true;
            await MusicDispatcher.stop();
            Wait(500);
            interaction.editReply({ embeds: [client.util.embed().setDescription('Cleared The Queue And Left The Voice Channel')] });
        } catch (error) {
            interaction.reply(`${error.message}`);
        }
    }
};