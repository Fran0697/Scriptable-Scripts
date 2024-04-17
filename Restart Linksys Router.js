// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const { USERNAME: MODEM_USERNAME, PASSWORD: MODEM_PASSWORD } = importModule('RestartModemProperties');
const { ROUTER_NAME, LOGIN_URL, REBOOT_URL, USERNAME, PASSWORD, LOGIN_HEADERS, REBOOT_HEADERS, EMAIL_RECIPIENTS, EMAIL_SENDER } = importModule('RestartLinksysRouterProperties');
const modemService = importModule('ModemService');

const restartRouter = async () => {
    try {
        const routerIp = await modemService.getRouterIpByName(ROUTER_NAME, MODEM_USERNAME, MODEM_PASSWORD);
        const httpClient = await createHttpClient();
        const response = await loginToRouter(routerIp, httpClient);
        await rebootRouter(routerIp, httpClient, response.session.token);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
};

const createHttpClient = async () => {
    const httpClient = new Request('');
    httpClient.allowInsecureRequest = true;
    httpClient.method = 'POST';
    return httpClient;
};

const sendRequest = async (httpClient, url, body = '{}', headers = {}, jsonResponse) => {
    httpClient.url = url;
    httpClient.body = body;
    httpClient.headers = headers;
    const response = await (jsonResponse ? httpClient.loadJSON() : httpClient.load());
    return response;
};

const loginToRouter = async (routerIp, httpClient) => {
    const url = `https://${routerIp}/${LOGIN_URL}`;
    const body = createLoginBody(USERNAME, PASSWORD);
    const headers = LOGIN_HEADERS;
    const response = await sendRequest(httpClient, url, body, headers, true);
    return response;
};

const rebootRouter = async (routerIp, httpClient, token) => {
    const url = `https://${routerIp}/${REBOOT_URL}`;
    const headers = { ...REBOOT_HEADERS };
    addSessionToken(headers, token);
    await sendRequest(httpClient, url, '{}', headers, false);
};

const createLoginBody = (username, password) => {
    return JSON.stringify({
        session: {
            account: {
                username,
                password
            }
        }
    });
};

const addSessionToken = (headers, token) => {
    const [key] = Object.entries(headers).find(([_, value]) => value === null) || [];
    if (key) {
        headers[key] = token;
    }
};

const output = await restartRouter();
Script.setShortcutOutput(output);
