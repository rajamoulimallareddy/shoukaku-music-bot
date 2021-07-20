/* eslint-disable linebreak-style */
const MusicDispatcher = require('./MusicDispatcher.js');

class MusicQueue extends Map {
    constructor(client, iterable) {
        super(iterable);
        this.client = client;
    }
    async handle(node, track, message) {

        const existing = this.get(message.guild.id);

        if (!existing) {
            const player = await node.joinVoiceChannel({
                guildID: message.guild.id,
                voiceChannelID: message.member.voice.channelID,
                deaf: true
            });

            if (message.guild.me.voice.serverMute === false) {
                message.guild.me.voice.setDeaf(true);
            }

            const dispatcher = new MusicDispatcher({
                client: this.client,
                guild: message.guild,
                text: message.channel,
                player
            });

            dispatcher.queue.push(track);
            this.set(message.guild.id, dispatcher);
            return dispatcher;

        }
        existing.queue.push(track);
        return null;
    }
}
module.exports = MusicQueue;
