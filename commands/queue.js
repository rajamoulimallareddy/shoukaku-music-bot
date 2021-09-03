/* eslint-disable linebreak-style */
const { messagepaginationEmbed } = require('../sturcturesExtends/pagination.js');
const { MessageButton, } = require('discord.js');
let chunk = require('chunk');
module.exports = {
    name: 'queue',
    description: 'shows total all the tracks in queue',
    aliases: ['q'],
    guildOnly: false,
    args: false,
    usage: '',
    execute: async (message, args, client) => {
        if (!message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in a voice channel to perform this.').setColor('RED')], allowedMentions: { repliedUser: false } });
        const MusicDispatcher = client.queue.get(message.guild.id);
        if (!MusicDispatcher || !MusicDispatcher.current)
            return await message.reply({ embeds: [client.util.embed().setDescription('There is Nothing playing in thie guild.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (MusicDispatcher.player.connection.channelId !== message.member.voice.channelId)
            return await message.reply({ embeds: [client.util.embed().setDescription('You are not in the same voice channel where I am.').setColor('RED')], allowedMentions: { repliedUser: false } });
        if (!MusicDispatcher.queue.length)
            return await message.reply({ embeds: [client.util.embed().setDescription('There is currently no song in the queue.').setColor('RED')], allowedMentions: { repliedUser: false } });
        try {
            const queue = MusicDispatcher.queue.map((t, i) => `\`${++i}.\`[${t.info.title}](${t.info.uri}) ${t.info.isStream ? '[StreamingLive]' : `[${client.util.millisToDuration(t.info.length)}]`} `);
            const chunked = chunk(queue, 10);
            const embeds = [];
            for (let i = 1; i <= chunked.length; ++i)
                embeds.push(client.util.embed().setDescription(`${chunked[i - 1].join('\n')}`).setFooter(`Page ${i + 1}/${i.length}`));
            const button1 = new MessageButton()
                .setCustomId('first')
                .setLabel('First')
                .setStyle('SECONDARY');
            const button2 = new MessageButton()
                .setCustomId('back')
                .setLabel('Back')
                .setStyle('SECONDARY');
            const button3 = new MessageButton()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle('SECONDARY');
            const button4 = new MessageButton()
                .setCustomId('last')
                .setLabel('Last')
                .setStyle('SECONDARY');
            const buttonList = [button1, button2, button3, button4];
            messagepaginationEmbed(message, embeds, buttonList, message.author, 30000);
        } catch (error) {
            message.channel.send(`${error.message}`);
        }
    }
};