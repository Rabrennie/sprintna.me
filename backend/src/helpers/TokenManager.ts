import { IncomingMessage } from 'http';
import url from 'url';
import short from 'short-uuid';

class TokenManager {
    ids: Map<string, string>;

    constructor() {
        this.ids = new Map();
    }

    getIdForRequest(req: IncomingMessage) {
        let {
            query: { token },
        } = url.parse(req.url, true);

        if (Array.isArray(token)) {
            token = token[0];
        }

        if (token && this.ids.has(token)) {
            return { id: this.ids.get(token), token: token };
        }

        const id = short.generate();
        const newToken = short.generate();
        this.ids.set(newToken, id);

        return { id, token: newToken };
    }
}

export default TokenManager;
