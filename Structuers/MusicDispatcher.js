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
                .setDescription(`[${this.current.info.title}](${this.current.info.uri})(${util.millisToDuration(this.current.info.length)}) - ${this.current.info.requester}`);
            this.text.send(embed);
        });

        this.player.on('end', () => {
            this.previous = this.current;
            this.current = null;
            this.play()
                .catch(() => {
                    this.queue.length = 0;
                    this.destroy();
                });
        });

        for (const playerEvent of ['closed', 'error', 'nodeDisconnect']) {
            this.player.on(playerEvent, data => {
                if (data instanceof Error || data instanceof Object)
                    console.log(data);
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
        await this.player.playTrack(this.current.track);
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
        this.player.disconnect();
        this.client.queue.delete(this.guild.id);
        this.text.send(util.embed().setDescription('Queue Is Empty').setColor('GREEN')).catch(() => null);
    }
}

module.exports = MusicDispatcher;