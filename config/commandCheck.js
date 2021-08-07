/* eslint-disable linebreak-style */
/* eslint-disable no-prototype-builtins */
/* eslint-disable linebreak-style */
const checkCommandModule = (cmdName, cmdModule) => {

    if (!cmdModule.hasOwnProperty('execute')) { throw new Error(`${cmdName} command module does not have property 'execute'`); }
    if (!cmdModule.hasOwnProperty('description')) { throw new Error(`${cmdName} command module does not have property 'description`); }
    if (!cmdModule.hasOwnProperty('aliases')) { throw new Error(`${cmdName} command module does not have property 'aliases'`); }
    return true;
};

const checkCommandProperties = (cmdName, cmdModule) => {
    if (typeof cmdModule.execute !== 'function') { throw new Error(`${cmdName} command: execute is not a function`); }
    if (typeof cmdModule.description !== 'string') { throw new Error(`${cmdName} command: description is not a string`); }
    if (!Array.isArray(cmdModule.aliases)) { throw new Error(`${cmdName} command: aliases is not an Array`); }
    return true;
};

module.exports = (cmdName, cmdModule) => {
    return checkCommandModule(cmdName, cmdModule) && checkCommandProperties(cmdName, cmdModule);
};