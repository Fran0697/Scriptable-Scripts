// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: cogs;
const { MODEM_BASE_URL, REBOOT_COMMAND, LOGIN_COMMAND, CLIENT_LIST_COMMAND } = importModule('RestartModemProperties');

module.exports.rebootModem = async (username, password) => {
    const authenticatedClient = await createAuthenticatedClient(username, password);
    const url = `${MODEM_BASE_URL}${REBOOT_COMMAND}`;
    await sendRequest(authenticatedClient, url);
};

module.exports.getRouterIpByName = async (routerName, username, password) => {
    const authenticatedClient = await createAuthenticatedClient(username, password);
    const routerIp = await getRouterIpByName(authenticatedClient, routerName);
    return routerIp;
};

const createAuthenticatedClient = async (username, password) => {
    const httpClient = new Request('');
    httpClient.allowInsecureRequest = true;
    await loginToModem(httpClient, username, password);
    return httpClient;
};

const sendRequest = async (httpClient, url) => {
    httpClient.url = url;
    const response = await httpClient.loadString();
    return response;
};

const loginToModem = async (httpClient, username, password) => {
    const url = `${MODEM_BASE_URL}${formatString(LOGIN_COMMAND, username, password)}`;
    await sendRequest(httpClient, url);
};

const getRouterIpByName = async (httpClient, routerName) => {
    const url = `${MODEM_BASE_URL}${CLIENT_LIST_COMMAND}`;
    const html = await sendRequest(httpClient, url);
    return getDeviceIp(html, routerName);
}

const getDeviceIp = (htmlString, deviceName) => {
    const regexPattern = new RegExp(`N:${deviceName}\\*I:(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})`);
    return htmlString.match(regexPattern)[1];
}

const formatString = (format, ...args) => {
    return format.replaceAll(/\${\d+}/g, match => {
        const index = parseInt(match.substring(2, match.length - 1));
        return args[index];
    });
};
