/* eslint-disable linebreak-style */
/* eslint-disable no-prototype-builtins */
/* eslint-disable linebreak-style */
const checkInteractionModule = (intName, intModule) => {
    if (!intModule.hasOwnProperty('execute')) { throw new Error(`${intName} interaction module does not have property 'execute'`); }
    if (!intModule.hasOwnProperty('description')) { throw new Error(`${intName} interaction module does not have property 'description`); }
    return true;
};

const checkInteractionProperties = (intName, intModule) => {
    if (typeof intModule.execute !== 'function') { throw new Error(`${intName} interaction: execute is not a function`); }
    if (typeof intModule.description !== 'string') { throw new Error(`${intName} interaction: description is not a string`); }
    if (typeof intModule.options === undefined) { throw new Error(`${intName} interaction: must have "options"`); }
    return true;
};

module.exports = (intName, intModule) => {
    return checkInteractionModule(intName, intModule) && checkInteractionProperties(intName, intModule);
};