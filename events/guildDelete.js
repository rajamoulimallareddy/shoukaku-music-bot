/* eslint-disable linebreak-style */
module.exports = {
    event: 'guildDelete',
    run: async (guild) => {
        console.log(`i have kicked from ${guild.name}`);
    },
};