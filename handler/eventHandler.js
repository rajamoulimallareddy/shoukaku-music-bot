/* eslint-disable linebreak-style */
module.exports = (err, files, client) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const eventFunction = require(`./../events/${file}`);
        if (eventFunction.disabled) return;

        const event = eventFunction.event || file.split('.')[0];
        const emitter =
            (typeof eventFunction.emitter === 'string'
                ? client[eventFunction.emitter]
                : eventFunction.emitter) || client;
        const once = eventFunction.once;

        try {
            emitter[once ? 'once' : 'on'](event, (...args) =>
                eventFunction.run(...args, client),
            );
        }
        catch (error) {
            console.error(error.stack);
        }
    });
};