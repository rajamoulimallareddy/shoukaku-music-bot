/* eslint-disable linebreak-style */
const { ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = {
    name: 'seek',
    description: 'seeks to a specific time',
    options: [{
        name: 'seconds',
        type: ApplicationCommandOptionType.String,
        description: 'type in seconds to seek',
        required: true,
    }],
    execute: async ({ interaction, client }) => {

        if (!interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')] });
        const MusicDispatcher = client.queue.get(interaction.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')] });
        if (MusicDispatcher.player.connection.channelId !== interaction.member.voice.channelId)
            return await interaction.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')] });
        if (!MusicDispatcher.current.info.isSeekable)
            return interaction.reply({ embeds: [client.util.embed().setDescription('Current track isn\'t seekable.')], allowedMentions: { repliedUser: false } });
        const duration = interaction.options.getString('seconds', true);
        if (!duration && !isNaN(duration)) {
            return interaction.reply({ embeds: [client.util.embed().setDescription('You must provide a time format to seek')], allowedMentions: { repliedUser: false } });
        } else if (duration && isNaN(duration)) {
            return interaction.reply({ embeds: [client.util.embed().setDescription('Wrong Usage E.g., `seek<seconds>`')], allowedMentions: { repliedUser: false } });
        }

        const durationMs = client.util.durationToMillis(duration);
        if (durationMs > MusicDispatcher.current.info.length)
            return interaction.reply({ embeds: [client.util.embed().setDescription('The duration you provide exceeds the duration of the current track')], allowedMentions: { repliedUser: false } });

        try {
            await MusicDispatcher.player.seekTo(duration * 1000);
            interaction.reply({
                embeds: [client.util.embed().setDescription(`Seeked to \`${client.util.millisToDuration(durationMs)}\``)], allowedMentions: { repliedUser: false }
            });
        } catch (error) {
            interaction.reply(`${error.message}`);
        }

    }
};
