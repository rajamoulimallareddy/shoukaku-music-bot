/* eslint-disable linebreak-style */
module.exports = {
    event: 'guildCreate',
    run: async (guild) => {
        console.log(`i have been added into ${guild.name}`);
    },
};