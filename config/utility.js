/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

module.exports = class Util {
    static embed() {
        return new MessageEmbed()
            .setColor('GREEN');
    }

    static durationToMillis(dur) {
        return dur.split(':').map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }

    static millisToDuration(ms) {
        return prettyMilliseconds(ms, { colonNotation: true, secondsDecimalDigits: 0 });
    }

    static chunk(arr, size) {
        const temp = [];
        for (let i = 0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i + size));
        }
        return temp;
    }

    static shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    static get paginationEmojis() {
        return ['⏫', '⬆️', '⬇️', '⏬'];
    }

    static async pagination(message, author, contents, init = true, currPage = 0) {
        if (init) for (const emoji of this.paginationEmojis) await message.react(emoji);

        const collector = message.createReactionCollector((reaction, user) => {
            return this.paginationEmojis.includes(reaction.emoji.name) && user.id === author.id;
        }, {
            max: 1,
            time: 30000
        });

        collector
            .on('collect', reaction => {
                reaction.users.remove(author);

                const emoji = reaction.emoji.name;
                if (emoji === this.paginationEmojis[0]) currPage = 0;
                if (emoji === this.paginationEmojis[1]) currPage--;
                if (emoji === this.paginationEmojis[2]) currPage++;
                if (emoji === this.paginationEmojis[3]) currPage = contents.length - 1;
                currPage =
                    (currPage % contents.length + contents.length) % contents.length;
                const dispatcher = message.client.queue.get(message.guild.id);
                const queue = dispatcher.queue.map((t, i) => `\`${++i}.\` [${t.info.title}](${t.info.uri})[${this.millisToDuration(t.info.length)}]`);

                const embed = message.embeds[0]
                    .setAuthor(` |  ${message.guild.name} Music Queue`, message.guild.iconURL({ dynamic: true }))
                    .setDescription(`🔊 Now Playing: \n${dispatcher.current.info.isStream ? '[**◉ LIVE**]' : ''}[${dispatcher.current.info.title}](${dispatcher.current.info.uri}) [${this.millisToDuration(dispatcher.current.info.length - dispatcher.player.position)} Left]\n\n🔊Up Next:\n${contents[currPage] == '' ? '  No other tracks here' : '' + contents[currPage]}`)
                    .setFooter(`Page ${currPage + 1}/${contents.length} | Track's in Queue: ${queue.length} | Total Length: ${this.millisToDuration(dispatcher.queue.reduce((prev, curr) => prev + curr.info.length, 0) + (dispatcher.current.info.length - dispatcher.player.position))}`);
                message.edit('', embed);

                this.pagination(message, author, contents, false, currPage);
            })
            .on('end', (_, reason) => {
                if (['time', 'user'].includes(reason)) message.reactions.removeAll();
            });
    }
};