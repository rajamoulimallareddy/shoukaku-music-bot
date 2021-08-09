/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const config = require('../config/config.json');
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

    static checkPermission(permissions, interaction) {
        if (permissions.includes('OWNER'))
            return config.owners.includes(interaction.user.id);
        else
            return interaction.channel.permissionsFor(interaction.member).has(permissions);
    }
};