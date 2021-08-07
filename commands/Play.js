/* eslint-disable linebreak-style */
module.exports = {
    name: 'play',
    description: 'Automatically fetches the video(s) and joins the channel.',
    aliases: ['p'],
    guildOnly: false,
    args: false,
    usage: '[search/link]',
    botPerms: ['CONNECT', 'SPEAK', 'SEND_MESSAGES'],
    execute: async (message, args, client) => {
        if (!message.member.voice.channelId) {
            return await message.reply({ embeds: [client.util.embed().setDescription('you are not in a voice channel to perform this.').setColor('RED')], allowedMentions: { repliedUser: false } });
        }
        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return await message.reply({ embeds: [client.util.embed().setDescription('you should be in same voice channel as i am in.').setColor('RED')], allowedMentions: { repliedUser: false } });
        }
        const MusicDispatcher = client.queue.get(message.guild.id);

        if (!args[0])
            return await message.reply({ embeds: [client.util.embed().setDescription('you did not specify a link or search mode').setColor('RED')], allowedMentions: { repliedUser: false } });

        const node = client.shoukaku.getNode();
        let SearchQuery = args.join(' ');

        if (_checkURL(SearchQuery)) {
            const result = await node.rest.resolve(SearchQuery);
            if (!result || !result.tracks.length)
                return await message.reply({ embeds: [client.util.embed().setDescription('Couldn\'t find Anything in the Given SearchQuery').setColor('RED')], allowedMentions: { repliedUser: false } });
            const { type, tracks, playlistName } = result;
            const track = tracks.shift();
            track.info.requester = message.author;
            const isPlaylist = type === 'PLAYLIST';
            const res = await client.queue.handle(node, track, message);

            if (isPlaylist) {
                for (const track of tracks) await client.queue.handle(node, track, message);
            }
            if (track.info.title.length > 64) track.info.title = `${track.info.title.split('[').join('[').split(']').join(']').substr(0, 64)}...`;
            if (MusicDispatcher && !MusicDispatcher.player.paused)
                await message.reply(isPlaylist ?
                    {
                        embeds: [client.util.embed()
                            .setDescription(`Loaded **${tracks.length}** tracks from: \`${playlistName}\``).setColor('GREEN')], allowedMentions: { repliedUser: false }
                    }
                    :
                    {
                        embeds: [client.util.embed()
                            .setAuthor(`Queued at Poisition #${MusicDispatcher.queue.length}`)
                            .setDescription(` ${track.info.isStream ? '[StreamingLive]\n' : ''}[${track.info.title}](${track.info.uri}) [${track.info.requester}]`).setColor('GREEN')], allowedMentions: { repliedUser: false }
                    }
                ).catch(() => null);
            if (res) await res.play();
            return;
        }
        SearchQuery = args.join(' ');
        const searchData = await node.rest.resolve(SearchQuery, 'youtube');
        if (!searchData || !searchData.tracks.length)
            return await message.reply({ embeds: [client.util.embed().setDescription('Couldn\'t find Anything in the Given SearchQuery').setColor('RED')], allowedMentions: { repliedUser: false } });
        const track = searchData.tracks.shift();
        track.info.requester = message.author;
        const res = await client.queue.handle(node, track, message);
        if (track.info.title.length > 64) track.info.title = `${track.info.title.split('[').join('[').split(']').join(']').substr(0, 64)}...`;
        if (MusicDispatcher && !MusicDispatcher.player.paused)
            await message.reply({
                embeds: [client.util.embed()
                    .setAuthor(`Queued at Poisition #${MusicDispatcher.queue.length}`)
                    .setDescription(`[${track.info.title}](${track.info.uri}) [${track.info.requester}]`).setColor('GREEN')], allowedMentions: { repliedUser: false }
            }).catch(() => null);
        if (res) await res.play();
    }
};
function _checkURL(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}