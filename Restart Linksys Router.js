// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const emailService = importModule('EmailService');
const {
    ROUTER_BASE_URL,
    LOGIN_URL,
    REBOOT_URL,
    USERNAME,
    PASSWORD,
    LOGIN_HEADERS,
    REBOOT_HEADERS,
    EMAIL_RECIPIENTS,
    EMAIL_SENDER
} = importModule('RestartLinksysRouterProperties');;

const restartRouter = async () => {
    try {
        const httpClient = await createHttpClient();
        const response = await loginToRouter(httpClient);
        await rebootRouter(httpClient, response.session.token);
        return true;
    } catch (error) {
        await logError(error);
        return false;
    }
};

const createHttpClient = async () => {
    const httpClient = new Request('');
    httpClient.allowInsecureRequest = true;
    httpClient.method = 'POST';
    return httpClient;
};

const sendRequest = async (httpClient, url, body = '{}', headers = {}) => {
    httpClient.url = url;
    httpClient.body = body;
    httpClient.headers = headers;
    await httpClient.load();
};

const loginToRouter = async (httpClient) => {
    const url = `${ROUTER_BASE_URL}${LOGIN_URL}`;
    const body = createLoginBody(USERNAME, PASSWORD);
    const headers = LOGIN_HEADERS;
    return await sendRequest(httpClient, url, body, headers);
};

const rebootRouter = async (httpClient, token) => {
    const url = `${ROUTER_BASE_URL}${REBOOT_URL}`;
    const headers = { ...REBOOT_HEADERS };
    addSessionToken(headers, token);
    await sendRequest(httpClient, url, '{}', headers);
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

const logError = async (error) => {
    await emailService.sendEmail('Restart Linksys Router failure', error, EMAIL_SENDER, EMAIL_RECIPIENTS);
};

const output = await restartRouter();
Script.setShortcutOutput(output);
