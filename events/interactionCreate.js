/* eslint-disable linebreak-style */
module.exports = {
    event: 'interactionCreate',
    run: async (interaction, client) => {
        try {
            if (!interaction.isCommand()) return;
            const command = client.slashs.get(interaction.commandName);
            if (!command) return;
            if (command.permissions && !client.util.checkPermission(command.permissions, interaction))
                return interaction.reply('You Dont have permission to use this command');
            await command.execute({ interaction, client });
        }
        catch (error) {
            console.error(error);
            interaction.reply('There was an error trying to execute that command!');
        }
    },
};