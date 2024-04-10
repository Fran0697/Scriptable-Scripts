// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const emailService = importModule('EmailService');
const {
    MODEM_BASE_URL,
    REBOOT_COMMAND,
    LOGIN_COMMAND,
    USERNAME,
    PASSWORD,
    EMAIL_RECIPIENTS,
    EMAIL_SENDER
} = importModule('RestartModemProperties');

const restartModem = async () => {
    try {
        const httpClient = await createHttpClient();
        await loginToModem(httpClient);
        await rebootModem(httpClient);
        return true;
    } catch (error) {
        await logError(error);
        return false;
    }
};

const createHttpClient = async () => {
    const httpClient = new Request('');
    httpClient.allowInsecureRequest = true;
    return httpClient;
};

const sendRequest = async (httpClient, url) => {
    httpClient.url = url;
    await request.load();
};

const loginToModem = async (httpClient) => {
    const url = `${MODEM_BASE_URL}${formatString(LOGIN_COMMAND, USERNAME, PASSWORD)}`;
    await sendRequest(httpClient, url);
};

const rebootModem = async (httpClient) => {
    const url = `${MODEM_BASE_URL}${REBOOT_COMMAND}`;
    await sendRequest(httpClient, url);
};

const formatString = (format, ...args) => {
    return format.replaceAll(/\${\d+}/g, match => {
        const index = parseInt(match.substring(2, match.length - 1));
        return args[index];
    });
};

const logError = async (error) => {
    await emailService.sendEmail('Restart Modem failure', error, EMAIL_SENDER, EMAIL_RECIPIENTS);
};

const output = await restartModem();
Script.setShortcutOutput(output);
