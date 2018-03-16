import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { errorLog } from './log';


export const GET: string = 'get';
export const POST: string = 'post';
export const PUT: string = 'put';
export const DELETE: string = 'delete';
export const HEAD: string = 'head';
export const OPTIONS: string = 'options';
export const logPrefix: string = 'RETRIEVEJS: ';

export interface ApiEndpoint { path: string, method: string }

export interface ApiEndpoints {
    [endpointName: string]: ApiEndpoint
}

export interface AxiosInstanceWithOptions extends AxiosInstance { options: (path: string, config: AxiosRequestConfig | undefined) => AxiosPromise }

export type ApiRequester = (config?: AxiosRequestConfig, params?: {}) => AxiosPromise

export interface Api {
    [key: string]: ApiRequester
}

/**
 * Creates an api object which contains functions depending on the endpoint object passed in the 1st parameter.
 *
 * ### Example (es imports)
 * ```js
 * import { createApi } from 'retrievejs';
 * const endpoints = {
        getMock: { path: 'http://www.mocky.io/v2/5aab93182e00004900138dd4', method: 'get' }
    };
 * const api = createApi(endpoints);
 * // => api.getMock().then((response) => console.log(response))
 * ```
 * @param {ApiEndpoints} endpoints
 * @param {AxiosInstanceWithOptions} _axios
 * @return {Api}
 */
export const createApi = (endpoints: ApiEndpoints, _axios?: AxiosInstanceWithOptions ) => {
    let axiosInstance: AxiosInstanceWithOptions;
    if(!_axios) {
        axiosInstance = axios as any;
    } else {
        axiosInstance = _axios;
    }

    const obj: Api = {};
    const requester = ({ path, method }: ApiEndpoint, key: string) => {
        if (!path || !method) {
            errorLog('Api config validation failed, missing path and/or method key');
        }

        if (method === GET) {
            obj[key] = async (config?: AxiosRequestConfig) => {
                return axiosInstance.get(path, config);
            };
        }
        if (method === POST) {
            obj[key] = async (config?, params?) => {
                return axiosInstance.post(path, params, config);
            };
        }
        if (method === PUT) {
            obj[key] = async (config?, params?) => {
                return axiosInstance.put(path, params, config);
            };
        }
        if (method === DELETE) {
            obj[key] = async (config?) => {
                return axiosInstance.delete(path, config);
            };
        }
        if (method === HEAD) {
            obj[key] = async (config?) => {
                return axiosInstance.head(path, config);
            };
        }
        if (method === OPTIONS) {
            obj[key] = async (config?) => {
                return axiosInstance.options(path, config);
            };
        }
    };

    for (const endpoint of Object.keys(endpoints)) {
        const val = endpoints[endpoint];
        requester(val, endpoint);
    }
    return obj;
};