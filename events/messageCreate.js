/* eslint-disable linebreak-style */
const permissions = require('../sturcturesExtends/permission.json');
const PrefixSchema = require('../schemas/PrefixSchema.js');
module.exports = {
    event: 'messageCreate',
    run: async (message, client) => {
        // used when bot is mentioned 
        const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
        // used when mention bot and use any command
        const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);
        // for mongodb 
        let data = await PrefixSchema.findOne({ ID: message.guild.id });
        // if there is custom prefix or for default prefix if no custom prefix 
        const prefix = data ? data.PREFIX : client.config.prefix;
        // to acces both prefix and mention prefix
        const DBPREFIX = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : prefix;
        // when the bot is mentioned it returns bot prefix
        if (message.content.match(mentionRegex)) message.reply({ embeds: [client.util.embed().setDescription(`This server's prefix is \`${DBPREFIX}\``)], allowedMentions: { repliedUser: false } });
        // if it is a bot which used the command or mentioned it returns & if content dosent starts with prefix or mention prefix
        if (!message.content.toLowerCase().startsWith(DBPREFIX) || message.author.bot) return;
        // 
        const [commandName, ...args] = message.content.slice(DBPREFIX.length).trim().split(/ +/g);
        // search for command or prefix and then reply  
        const command = client.commands.get(commandName.toLowerCase()) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName.toLowerCase()));
        // if some one accidentally type command which is not in help it returns
        if (!command) return;
        // if it is only for guild
        if (command.guildOnly && message.channel.type !== 'GUILD_TEXT') {
            return message.reply('I can\'t execute that command inside DMs!');
        }
        // check permissions
        if (message.guild) {
            // check bot permissions
            if (command.botPerms) {
                const missingPermissions =
                    message.channel.permissionsFor(message.guild.me).missing(command.botPerms).map(p => permissions[p]);
                // if bots dosen't have perms which are mentioned in command it returns the below message
                if (missingPermissions.length !== 0) {
                    return message.reply(`I am missing ${missingPermissions.map(p => `${p}`).join(' - ')} permissions, I need them to use this command!`).catch(() => { });
                }
            }
            // check user permissions
            if (command.userPerms) {
                const missingPermissions =
                    message.channel.permissionsFor(message.author).missing(command.userPerms).map(p => permissions[p]);
                // if user dosen't have perms which are mentioned in command it returns the below message
                if (missingPermissions.length !== 0) {
                    return message.reply(`You are missing ${missingPermissions.map(p => `${p}`).join('\n')} permissions, you need them to use this command!`).catch(() => { });
                }
            }
        }
        // if some one execute a command which is owneronly it returns nothing or if you want it to reply just remove the /* */
        if (command.owneronly) {
            if (!client.config.owners.includes(message.author.id)) return /*message.reply('Sorry, this command can only be used by the bot owners.')*/;
        }
        // if args true it returns usage of the command 
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${DBPREFIX}${command.name} ${command.usage}\``;
            }
            return message.reply(reply);
        }
        try {
            // excute/run commands
            command.execute(message, args, client);
        }
        catch (error) {
            console.error(error.message);
            message.reply('There was an error trying to execute that command!');
        }
    },
};