// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const properties = importModule('RestartLinksysRouterProperties');

const main = async () => {
    try {
        const { ROUTER_BASE_URL, LOGIN_URL, REBOOT_URL, USERNAME, PASSWORD, LOGIN_HEADERS, REBOOT_HEADERS } = properties;

        //TODO dynamically get the IP of the router
        const httpClient = new Request('');
        httpClient.allowInsecureRequest = true;
        httpClient.method = 'POST';

        //Login to the router
        httpClient.url = `${ROUTER_BASE_URL}${LOGIN_URL}`;
        httpClient.body = createLoginBody(USERNAME, PASSWORD);
        httpClient.headers = LOGIN_HEADERS;
        const response = await httpClient.loadJSON();

        //Restart router
        addSessionToken(REBOOT_HEADERS, response.session.token);
        httpClient.url = `${ROUTER_BASE_URL}${REBOOT_URL}`;
        httpClient.body = '{}';
        httpClient.headers = REBOOT_HEADERS;
        console.log(httpClient);
        await httpClient.load();
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const createLoginBody = (username, password) => {
    const sessionJSON = {
        session: {
            account: {
                username,
                password
            }
        }
    };
    return JSON.stringify(sessionJSON);
};

const addSessionToken = (headers, token) => {
    Object.entries(headers).find(([key, value]) => {
        if (value === null) {
            headers[key] = token;
            return true;
        }
    });
};

const successfull = await main();
Script.setShortcutOutput(successfull);