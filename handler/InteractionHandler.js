/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const ascii = require('ascii-table');
const interactionCheck = require('./../sturcturesExtends/interactionCheck');
const table = new ascii().setHeading('Slashs    ', 'Load Status');

module.exports = (err, files, client) => {
    if (err) return console.error(err);

    files.forEach((file, index) => {
        const slashcommand = require(`./../slashcommands/${file}`);
        if (interactionCheck(slashcommand.name, slashcommand)) {
            if (slashcommand.name) {
                client.slashs.set(slashcommand.name, slashcommand);
                table.addRow(slashcommand.name, '✅');
            }
            else {
                table.addRow(slashcommand.name, '✖');
            }
        }
        if (index == files.length - 1) console.log(table.toString());
    });

};