/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
module.exports = {
    name: 'eval',
    description: 'Only the owner of this bot can use this command.',
    aliases: ['evaluate'],
    guildOnly: false,
    args: false,
    usage: '[command name]',
    ownerOnly: true,
    execute: async (message, args, client) => {

        const content = message.content.split(' ').slice(1).join(' ');
        const result = new Promise((resolve, reject) => resolve(eval(content)));

        return result.then((output) => {
            if (typeof output !== 'string') {
                output = require('util').inspect(output, { depth: 0 });
            }
            if (output.includes(client.config.token)) {
                output = output.replace(client.config.token, 'T0K3N');
            }
            message.channel.send(output, {
                code: 'js'
            });
        }).catch((err) => {
            err = err.toString();
            if (err.includes(client.config.token)) {
                err = err.replace(client.config.token, 'T0K3N');
            }
            message.channel.send(err, {
                code: 'js'
            }); 
        });
    },
};