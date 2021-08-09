/* eslint-disable linebreak-style */
const { ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = {
    name: 'volume',
    description: 'Sets current Play back volume of the player.',
    options: [{
        name: 'input',
        type: ApplicationCommandOptionType.String,
        description: 'type in volume',
        required: true,
    }],
    execute: async ({ interaction, client }) => {
        const newVolume = interaction.options.getString('input', true);
        if (!interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')] });
        const MusicDispatcher = client.queue.get(interaction.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')] });
        if (MusicDispatcher.player.connection.channelId !== interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')] });

        try {
            if (newVolume < 0 || newVolume > 500)
                return interaction.reply({
                    embeds: [this.client.util.embed()
                        .setDescription('You can only set the volume from 0-500.')]
                });
            await MusicDispatcher.player.setVolume(newVolume / 100);
            interaction.reply({
                embeds: [this.client.util.embed()
                    .setDescription(`The playback volume is now set to: \`${newVolume}\``)]
            });
        } catch (err) {
            interaction.reply(`${err.message}`);
        }
    }
};