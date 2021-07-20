/* eslint-disable linebreak-style */
module.exports = {
    name: 'volume',
    description: 'Sets current Play back volume of the player.',
    aliases: ['vol'],
    guildOnly: false,
    args: false,
    usage: '[0-500]',
    execute: async (message, args, client) => {
        const newVolume = Number(args[0]);

        if (!message.member.voice.channelID)
            return await message.channel.send(client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED'));
        const MusicDispatcher = client.queue.get(message.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await message.channel.send(client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED'));
        if (MusicDispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID)
            return await message.channel.send(client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED'));

        try {
            if (isNaN(newVolume)) {
                message.channel.send(client.util.embed()
                    .setDescription(`Current volume: \`${MusicDispatcher.player.filters.volume * 100}\``));
            } else {
                if (newVolume < 0 || newVolume > 500)
                    return message.channel.send(client.util.embed()
                        .setDescription('You can only set the volume from 0-500.'));
                await MusicDispatcher.player.setVolume(newVolume / 100);
                message.channel.send(client.util.embed()
                    .setDescription(`The playback volume is now set to: \`${newVolume}\``));
            }
        } catch (err) {
            console.log(err.message);
        }
    }
};