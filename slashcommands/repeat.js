/* eslint-disable linebreak-style */
const { ApplicationCommandOptionType } = require('discord-api-types/v9');
const modes = { 1: 'track', 2: 'queue', 0: 'none' };
module.exports = {
    name: 'repeat',
    description: 'set repeat',
    options: [{
        name: 'mode',
        type: ApplicationCommandOptionType.String,
        description: 'The New Repeat Mode',
        choices: [{
            name: 'track',
            value: '1'
        }, {
            name: 'queue',
            value: '2'
        }, {
            name: 'disbaled',
            value: '0'
        }],
        required: true
    }],
    execute: async ({ interaction, client }) => {
        if (!interaction.member.voice.channelId)
            return interaction.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')] });
        const MusicDispatcher = client.queue.get(interaction.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return interaction.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')] });
        if (MusicDispatcher.player.connection.channelId !== interaction.member.voice.channelId)
            return interaction.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')] });
        if (!MusicDispatcher.current.info.isSeekable)
            return interaction.reply({ embeds: [client.util.embed().setDescription('Current track isn\'t seekable.')] });
        try {
            MusicDispatcher.repeat = Number(interaction.options.getString('mode'));
            await interaction.reply({
                embeds: [client.util.embed()
                    .setDescription(MusicDispatcher.repeat === 0 ? 'I have disabled the repeat.' : `I have set repeat to ${modes[MusicDispatcher.repeat]}`)]
            });
        } catch (error) {
            interaction.reply(`${error.message}`);
        }
    }
};