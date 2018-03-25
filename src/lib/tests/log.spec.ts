import test from 'ava';
import { errorLog, normalLog, warnLog } from '../log';

test('if it logs to the console', t => {
    try {
        warnLog('test');
        errorLog('test');
        normalLog('test');
        t.pass();
    } catch (err) {
        t.fail();
    }
});