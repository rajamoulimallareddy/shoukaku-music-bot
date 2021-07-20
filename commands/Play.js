/* eslint-disable linebreak-style */
module.exports = {
    name: 'play',
    description: 'Automatically fetches the video(s) and joins the channel.',
    aliases: ['p'],
    guildOnly: false,
    args: false,
    usage: '[search/link]',
    execute: async (message, args, client) => {
        if (!message.member.voice.channelID) {
            return await message.channel.send(client.util.embed().setDescription('you are not in a voice channel to perform this.').setColor('RED'));
        }
        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return await message.channel.send(client.util.embed().setDescription('you should be in same voice channel as i am in.').setColor('RED'));
        }

        if (!args[0])
            return await message.channel.send(client.util.embed().setDescription('you did not specify a link or search mode').setColor('RED'));

        const node = client.shoukaku.getNode();
        const SearchQuery = args.join(' ');

        if (_checkURL(SearchQuery)) {
            const result = await node.rest.resolve(SearchQuery);
            if (!result || !result.tracks.length)
                return await message.channel.send(client.util.embed().setDescription('Couldn\'t find Anything in the Given SearchQuery').setColor('RED'));
            const { type, tracks, playlistName } = result;
            const track = tracks.shift();
            track.info.requester = message.author;
            const isPlaylist = type === 'PLAYLIST';
            const res = await client.queue.handle(node, track, message);

            if (isPlaylist) {
                for (const track of tracks) await client.queue.handle(node, track, message);
            }
            await message.channel.send(isPlaylist ?
                client.util.embed().setDescription(`Loaded **${tracks.length}** tracks from: \`${playlistName}\``).setColor('GREEN')
                :
                client.util.embed()
                    .setDescription(`Queued ${track.info.isStream ? '[StreamingLive]\n' : ''}[${track.info.title}](${track.info.uri})(${client.util.millisToDuration(track.info.length)})`).setColor('GREEN')
            ).catch(() => null);
            if (res) await res.play();
            return;
        }

        const searchData = await node.rest.resolve(SearchQuery, 'youtube');
        if (!searchData || !searchData.tracks.length)
            return await message.channel.send(client.util.embed().setDescription('Couldn\'t find Anything in the Given SearchQuery').setColor('RED'));
        const track = searchData.tracks.shift();
        track.info.requester = message.author;
        const res = await client.queue.handle(node, track, message);
        await message.channel.send(client.util.embed().setDescription(`Queued ${track.info.isStream ? '[StreamingLive]\n' : ''}[${track.info.title}](${track.info.uri})(${client.util.millisToDuration(track.info.length)})`).setColor('GREEN')).catch(() => null);
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