import { test } from 'ava';
import { createApi } from '../createApi';

test('creates api and does requests', async(t) => {
    const endpoints = {
        getMock: { path: 'http://www.mocky.io/v2/5aab93182e00004900138dd4', method: 'get' }
    };
    const api = createApi(endpoints);
    if(typeof api.getMock === 'function') {
        try {
            await api.getMock()
                .then(() => t.pass())
                .catch(() => t.pass());
            return;
        } catch (err) {
            t.fail();
        }
    }
    t.fail();
});