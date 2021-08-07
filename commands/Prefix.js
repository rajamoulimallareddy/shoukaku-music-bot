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
        if (!newPrefix) return message.channel.send({
            embeds: [client.util.embed()
                .setDescription('Please Provide a Prefix.')], allowedMentions: { repliedUser: false }
        });
        if (newPrefix.length > 5) return message.channel.send({
            embeds: [client.util.embed()
                .setDescription('This prefix is too long, you have max 5 caracters')], allowedMentions: { repliedUser: false }
        });

        let data;
        data = await pSchema.findOne({
            ID: message.guild.id
        });

        if (!data) {
            let newdata = await pSchema.create({
                ID: message.guild.id,
                PREFIX: newPrefix
            });
            newdata.save();
        } else {
            await pSchema.findOneAndUpdate({
                ID: message.guild.id,
                PREFIX: newPrefix,
            });
        }

        message.channel.send({
            embeds: [client.util.embed()
                .setDescription(`Set New Prefix To: \`${newPrefix}\``)], allowedMentions: { repliedUser: false }
        }).catch((err) => { console.log(err.msg); });
    }
};