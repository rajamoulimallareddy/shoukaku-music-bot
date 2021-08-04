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
            const player = await node.joinChannel({
                guildID: message.guild.id,
                shardID: message.guild.shard.id,
                channelID: message.member.voice.channelId,
                deaf: true
            });
            this.client.logger.debug(player.constructor.name, `New connection @ guild "${message.guild.id}"`);
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
            this.client.logger.debug(dispatcher.constructor.name, `New player dispatcher @ guild "${message.guild.id}"`);
            return dispatcher;
        }
        existing.queue.push(track);
        if (!existing.current) existing.play();
        return null;
    }
}
module.exports = MusicQueue;
