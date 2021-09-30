/* eslint-disable linebreak-style */
class MusicDispatcher {
    constructor(options) {
        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.player = options.player;
        this.queue = [];
        this.current = null;
        this.previous = null;
        this.end = false;
        this.repeat = 0;

        this.player
            .on('start', () => {
                const embed = this.client.util.embed()
                    .setTitle('Now Playing')
                    .setDescription(`${this.current.info.isStream ? '[StreamingLive]\n' : ''}[${this.current.info.title}](${this.current.info.uri}) [${this.current.info.requester}]`);
                this.text.send({ embeds: [embed] });
            })
            .on('end', () => {
                this.previous = this.current;
                this.current = null;
                if (this.repeat === 1) this.queue.unshift(this.previous);
                else if (this.repeat === 2) this.queue.push(this.previous);
                this.play();
            })
            .on('exception', (exception) => {
                this.text.send({ embeds: [this.client.util.embed().setAuthor('Something went wrong with playing the Track').setDescription(`track - [${this.current.info.title}](${this.current.info.uri})\nerror - ${exception.error}`)] });
                this.client.logger.debug('TrackException', exception.error);
            })
            .on('error', console.error);
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

    async skip(skipto = 1) {
        if (!this.player) return;
        if (skipto > 1) {
            this.queue.unshift(this.queue[skipto - 1]);
            this.queue.splice(skipto, 1);
        }
        await this.player.stopTrack();
    }

    async stop() {
        if (!this.player) return;
        this.queue.length = 0;
        this.repeat = 0;
        await this.player.stopTrack();
    }

    destroy() {
        this.stop();
        this.player.connection.disconnect();
        this.client.queue.delete(this.guild.id);
        if (this.end) return;
        this.text.send({ embeds: [this.client.util.embed().setDescription('Destroyed the player and left the voice channel').setColor('GREEN')] }).catch(() => null);
    }
}

module.exports = MusicDispatcher;