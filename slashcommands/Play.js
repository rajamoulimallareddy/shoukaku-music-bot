/* eslint-disable linebreak-style */
const { ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = {
    name: 'play',
    description: 'Automatically fetches the video(s) and joins the voice channel you are in!',
    options: [{
        name: 'query',
        type: ApplicationCommandOptionType.String,
        description: 'The song you want to play',
        required: true,
    }],
    execute: async ({ interaction, client }) => {
        if (!interaction.member.voice.channelId) {
            return await interaction.reply({ embeds: [client.util.embed().setDescription('you are not in a voice channel to perform  ').setColor('RED')] });
        }
        if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
            return await interaction.reply({ embeds: [client.util.embed().setDescription('you should be in same voice channel as i am in.').setColor('RED')] });
        }
        await interaction.deferReply();
        let SearchQuery = interaction.options.getString('query', true);
        const node = client.shoukaku.getNode();

        if (checkURL(SearchQuery)) {
            const result = await node.rest.resolve(SearchQuery);
            if (!result)    
                return interaction.editReply({ embeds: [client.util.embed().setDescription('Couldn\'t find Anything in the Given SearchQuery').setColor('RED')] });
            const { type, tracks, playlistName } = result;
            const track = tracks.shift();
            const playlist = type === 'PLAYLIST';
            const res = await client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, track);
            if (playlist) {
                for (const track of tracks) await client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, track);
            }
            await interaction.editReply(isPlaylist ?
                {
                    embeds: [client.util.embed()
                        .setDescription(`Loaded **${tracks.length}** tracks from: \`${playlistName}\``).setColor('GREEN')]
                }
                :
                {
                    embeds: [client.util.embed()
                        .setDescription(`Queued ${track.info.isStream ? '[StreamingLive]\n' : ''}[${track.info.title}](${track.info.uri}) [${track.info.requester}]`).setColor('GREEN')]
                }
            ).catch(() => null);
            res?.play();
            return;
        }
        const tracksearch = await node.rest.resolve(SearchQuery, 'youtube');
        if (!tracksearch?.tracks.length)
            return interaction.editReply({ embeds: [client.util.embed().setDescription('Couldn\'t find Anything in the Given SearchQuery').setColor('RED')] });
        const track = tracksearch.tracks.shift();
        track.info.requester = interaction.member;
        if (track.info.title.length > 64) track.info.title = `${track.info.title.split('[').join('[').split(']').join(']').substr(0, 64)}...`;
        const res = await client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, track);
        await interaction
            .editReply({
                embeds: [client.util.embed()
                    .setDescription(`Queued [${track.info.title}](${track.info.uri}) [${track.info.requester}]`).setColor('GREEN')]
            }).catch(() => null);
        res?.play();
    }
};
function checkURL(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}