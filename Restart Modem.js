// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: file-contract;
const properties = importModule('RestartModemProperties');

const main = async () => {
    const { MODEM_BASE_URL, REBOOT_COMMAND, LOGIN_COMMAND, USERNAME, PASSWORD } = properties;

    try {
        const request = new Request(`${MODEM_BASE_URL}${formatString(LOGIN_COMMAND, USERNAME, PASSWORD)}`);
        request.allowInsecureRequest = true
        await request.load();
        request.url = `${MODEM_BASE_URL}${REBOOT_COMMAND}`
        await request.load();
    } catch (error) {
        console.log(error);
    }
};

const formatString = (format, ...args) => {
    return format.replaceAll(/\${\d+}/g, match => {
        const index = parseInt(match.substring(2, match.length - 1));
        return args[index];
    });
};


await main();
Script.setShortcutOutput('Done!')
