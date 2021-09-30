/* eslint-disable linebreak-style */
const { MessageActionRow } = require('discord.js'), util = require('./Utilities.js');
/**
 * Creates a pagination embed
 * @param {Message} message
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
 */
const messagepaginationEmbed = async (message, pages, buttonList, author, timeout) => {
    if (buttonList[0].style === 'LINK' || buttonList[1].style === 'LINK' || buttonList[2].style === 'LINK' || buttonList[3].style === 'LINK') { throw new Error('Link isnt supported.'); }
    let page = 0;
    const row = new MessageActionRow().addComponents(buttonList);
    const currentPage = await message.reply({ embeds: [pages[page].setFooter(` Page ${page + 1}/${pages.length} `)], components: [row], allowedMentions: { repliedUser: false } });

    const filter = (i) => i.customId === buttonList[0].customId || buttonList[1].customId || buttonList[2].customId || buttonList[3].customId;
    const collector = await currentPage.createMessageComponentCollector({ filter, time: timeout });

    collector
        .on('collect', async (i) => {
            await i.deferUpdate();
            if (i.user.id === author.id) {
                switch (i.customId) {
                    case buttonList[0].customId:
                        page = 0;
                        break;
                    case buttonList[1].customId:
                        page = page > 0 ? --page : pages.length - 1;
                        break;
                    case buttonList[2].customId:
                        page = page + 1 < pages.length ? ++page : 0;
                        break;
                    case buttonList[3].customId:
                        page = pages.length - 1;
                        break;
                    default:
                        break;
                }
                await i.editReply({ embeds: [pages[page].setFooter(`Page ${page + 1}/${pages.length}`)], components: [row] });
            } else {
                i.followUp({ embeds: [util.embed().setDescription(`Only ${author} can use this buttons!`)], ephemeral: true });
            }
            collector.resetTimer();
        })
        .on('end', () => {
            if (!currentPage.deleted) {
                const disabledRow = new MessageActionRow().addComponents(buttonList[0].setDisabled(true), buttonList[1].setDisabled(true), buttonList[2].setDisabled(true), buttonList[3].setDisabled(true));
                currentPage.edit({ embeds: [pages[page].setFooter(`Page ${page + 1}/${pages.length}`)], components: [disabledRow] });
            }
        });
    return currentPage;
};

const intpaginationEmbed = async (interaction, pages, buttonList, author, timeout) => {
    if (buttonList[0].style === 'LINK' || buttonList[1].style === 'LINK' || buttonList[2].style === 'LINK' || buttonList[3].style === 'LINK') { throw new Error('Link isnt supported'); }
    let page = 0;
    const row = new MessageActionRow().addComponents(buttonList);
    const currentPage = await interaction.reply({ embeds: [pages[page].setFooter(`Page ${page + 1}/${pages.length}`)], components: [row], fetchReply: true });

    const filter = (i) => i.customId === buttonList[0].customId || buttonList[1].customId || buttonList[2].customId || buttonList[3].customId;
    const collector = await currentPage.createMessageComponentCollector({ filter, time: timeout });

    collector
        .on('collect', async (i) => {
            await i.deferUpdate();
            if (i.user.id === author.id) {
                switch (i.customId) {
                    case buttonList[0].customId:
                        page = 0;
                        break;
                    case buttonList[1].customId:
                        page = page > 0 ? --page : pages.length - 1;
                        break;
                    case buttonList[2].customId:
                        page = page + 1 < pages.length ? ++page : 0;
                        break;
                    case buttonList[3].customId:
                        page = pages.length - 1;
                        break;
                    default:
                        break;
                }
                await i.editReply({ embeds: [pages[page].setFooter(`Page ${page + 1}/${pages.length}`)], components: [row] });
            } else {
                i.followUp({ embeds: [util.embed().setDescription(`Only ${author} can use this buttons!`)], ephemeral: true });
            }
            collector.resetTimer();
        })
        .on('end', () => {
            if (!currentPage.deleted) {
                const disabledRow = new MessageActionRow().addComponents(buttonList[0].setDisabled(true), buttonList[1].setDisabled(true), buttonList[2].setDisabled(true), buttonList[3].setDisabled(true));
                currentPage.edit({ embeds: [pages[page].setFooter(`Page ${page + 1}/${pages.length}`)], components: [disabledRow] });
            }
        });
    return currentPage;
};

module.exports = { messagepaginationEmbed, intpaginationEmbed };