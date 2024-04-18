// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const emailService = importModule('EmailService');
const modemService = importModule('ModemService');
const { USERNAME, PASSWORD } = importModule('RestartModemProperties');

const restartModem = async () => {
    try {
        await modemService.rebootModem(USERNAME, PASSWORD);
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const output = await restartModem();
Script.setShortcutOutput(output);
