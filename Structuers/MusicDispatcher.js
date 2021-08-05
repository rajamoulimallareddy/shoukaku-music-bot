/* eslint-disable linebreak-style */
const util = require('../config/utility.js');

class MusicDispatcher {
    constructor(options) {
        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.player = options.player;
        this.queue = [];
        this.current = null;
        this.previous = null;

        this.player.on('start', () => {
            const embed = util.embed()
                .setTitle('Now Playing:')
                .setDescription(`${this.current.info.isStream ? '[StreamingLive]\n' : ''}[${this.current.info.title}](${this.current.info.uri}) (${util.millisToDuration(this.current.info.length)}) - ${this.current.info.requester}`);
            this.text.send({ embeds: [embed], allowedMentions: { repliedUser: false } });
        }).on('end', () => {
            this.previous = this.current;
            this.current = null;
            this.play();
        }).on('trackException', e => {
            if (!this.player) return;
            this.text.send({ embeds: [util.embed().setAuthor('Something went wrong with playing the Track').setDescription(`track - [${this.current.info.title}](${this.current.info.uri})`)], allowedMentions: { repliedUser: false } });
            this.client.logger.debug('TrackException', e);
        }).on('error', console.error);

        for (const event of ['closed', 'error']) {
            this.player.on(event, data => {
                if (data instanceof Error || data instanceof Object) this.client.logger.error(data);
                this.queue.length = 0;
                this.destroy();
            });
        }
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    async play() {
        if (!this.exists || !this.queue.length) return this.destroy();
        this.current = this.queue.shift();
        this.player.setVolume(0.25);
        this.player.playTrack(this.current.track);
    }

    async pause() {
        if (!this.player) return;
        if (!this.player.paused) await this.player.setPaused(true);
    }

    async resume() {
        if (!this.player) return;
        if (this.player.paused) await this.player.setPaused(false);
    }

    async skip(to = 1) {
        if (!this.player) return;
        if (to > 1) {
            this.queue.unshift(this.queue[to - 1]);
            this.queue.splice(to, 1);
        }
        await this.player.stopTrack();
    }

    async stop() {
        if (!this.player) return;
        this.queue.length = 0;
        await this.player.stopTrack();
    }

    destroy() {
        this.queue.length = 0;
        this.player.connection.disconnect();
        this.client.queue.delete(this.guild.id);
        this.text.send({ embeds: [util.embed().setDescription('Destroyed the player and left the voice channel').setColor('GREEN')], allowedMentions: { repliedUser: false } }).catch(() => null);
    }
}

module.exports = MusicDispatcher;