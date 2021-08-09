/* eslint-disable linebreak-style */
const pSchema = require('../schemas/PrefixSchema.js');
const { ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = {
    name: 'prefix',
    description: 'sets prefix of the bot',
    options: [{
        name: 'prefix',
        type: ApplicationCommandOptionType.String,
        description: 'The song you want to play',
        required: true,
    }],
    execute: async ({ interaction, client }) => {
        const newPrefix = interaction.options.getString('prefix', true);

        if (newPrefix.length > 5) return interaction.reply({
            embeds: [client.util.embed()
                .setDescription('This prefix is too long, you have max 5 caracters')], allowedMentions: { repliedUser: false }
        });

        let data;
        data = await pSchema.findOne({
            ID: interaction.guildId
        });

        if (!data) {
            let newdata = await pSchema.create({
                ID: interaction.guildId,
                PREFIX: newPrefix
            });
            newdata.save();
        } else {
            await pSchema.findOneAndUpdate({
                ID: interaction.guildId,
                PREFIX: newPrefix,
            });
        }

        interaction.reply({
            embeds: [client.util.embed()
                .setDescription(`Set New Prefix To: \`${newPrefix}\``)], allowedMentions: { repliedUser: false }
        }).catch((err) => { console.log(err.msg); });
    }
};