import axios from 'axios/index';
import { DELETE, GET, HEAD, OPTIONS, POST, PUT } from './index';
import { errorLog } from './log';

export const createApi = (endpoints, _axios = axios) => {
    const obj = {};
    const requester = ({ path, method }, key) => {
        if (!path || !method) {
            errorLog('Api config validation failed, missing path and/or method key');
        }

        if (method === GET) {
            obj[key] = async (config) => {
                return _axios.get(path, config);
            };
        }
        if (method === POST) {
            obj[key] = async (config, params) => {
                return _axios.post(path, params, config);
            };
        }
        if (method === PUT) {
            obj[key] = async (config, params) => {
                return _axios.put(path, params, config);
            };
        }
        if (method === DELETE) {
            obj[key] = async (config) => {
                return _axios.delete(path, config);
            };
        }
        if (method === HEAD) {
            obj[key] = async (config) => {
                return _axios.head(path, config);
            };
        }
        if (method === OPTIONS) {
            obj[key] = async (config) => {
                return _axios.options(path, config);
            };
        }
    };

    for (const endpoint of Object.keys(endpoints)) {
        const val = endpoints[endpoint];
        requester(val, endpoint);
    }
    return obj;
};