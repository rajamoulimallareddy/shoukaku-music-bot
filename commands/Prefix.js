/* eslint-disable linebreak-style */
const pSchema = require('../schemas/PrefixSchema.js');
module.exports = {
    name: 'prefix',
    description: 'sets prefix of the bot',
    aliases: ['setprefix'],
    guildOnly: false,
    args: false,
    usage: '!',
    owneronly: false,
    userPerms: ['MANAGE_GUILD'],
    execute: async (message, args, client) => {
        const newPrefix = args[0];
        pSchema.findOne({ serverId: message.guild.id }, async (error, data) => {
            if (!newPrefix) return message.channel.send({
                embeds: [client.util.embed().setDescription('Please Provide a Prefix.')], allowedMentions: { repliedUser: false }
            });
            if (newPrefix.length > 5) return message.channel.send({
                embeds: [client.util.embed()
                    .setDescription('This prefix is too long, you have max 5 caracters')], allowedMentions: { repliedUser: false }
            });
            if (!data) {
                let newprefix = new pSchema({ serverId: message.guild.id, prefix: newPrefix });
                newprefix.save();
            }
            if (data) {
                await data.updateOne({ prefix: newPrefix });
            }
            message.reply({ embeds: [client.util.embed().setDescription(`Set prefix to: \`${newPrefix}\``)], allowedMentions: { repliedUser: false } }).catch((err) => { console.log(err.msg); });
        });
    }
};