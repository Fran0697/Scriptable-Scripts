// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const properties = importModule('RestartLinksysRouterProperties');

const main = async () => {
    const { ROUTER_BASE_URL, LOGIN_URL, REBOOT_URL, USERNAME, PASSWORD, LOGIN_HEADERS } = properties;

    try {
        const request = new Request(`${ROUTER_BASE_URL}${LOGIN_URL}`);

        request.allowInsecureRequest = true;
        request.method = 'POST';
        request.body = createLoginBody(USERNAME, PASSWORD);
        request.headers = LOGIN_HEADERS;
        const token = (await request.loadJSON()).session.token;

        request.url = `${ROUTER_BASE_URL}${REBOOT_URL}`
        request.body = '{}';
        request.headers = LOGIN_HEADERS;
    } catch (error) {
        console.log(error);
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

await main();
Script.setShortcutOutput('Done!');