import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { errorLog } from './log';
import { Store } from 'redux';


export const GET: string = 'get';
export const POST: string = 'post';
export const PUT: string = 'put';
export const DELETE: string = 'delete';
export const HEAD: string = 'head';
export const OPTIONS: string = 'options';
export const logPrefix: string = 'RETRIEVEJS: ';
export const RETRIEVEJS_PREFIX_ACTIONS: string = 'retrievejs/api/';

export interface ApiEndpoint {
    path: string,
    method: string
}

export interface ApiEndpoints {
    [endpointName: string]: ApiEndpoint
}

export interface AxiosInstanceWithOptions extends AxiosInstance {
    options: (path: string, config: AxiosRequestConfig | undefined) => AxiosPromise
}

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
 * @param store
 * @param {AxiosInstanceWithOptions} _axios
 * @return {Api}
 */
export const createApi = (endpoints: ApiEndpoints, store: Store<any>, _axios?: AxiosInstanceWithOptions) => {
    let axiosInstance: AxiosInstanceWithOptions;
    if (!_axios) {
        axiosInstance = axios as any;
    } else {
        axiosInstance = _axios;
    }

    const baseFunction = (method: string, path: string, key: string, params?: object, config?: AxiosRequestConfig) => {
        const dispatchSuccess = (response: any) => {
            store.dispatch({
                type: RETRIEVEJS_PREFIX_ACTIONS + key + '/success',
                payload: {
                    isFetching: false,
                    failed: false,
                    data: response,
                },
            });
        };
        const dispatchFailed = (error: any) => {
            store.dispatch({
                type: RETRIEVEJS_PREFIX_ACTIONS + key + '/failed',
                payload: {
                    isFetching: false,
                    failed: false,
                    data: error,
                },
            });
        };
        const dispatchLoading = () => {
            store.dispatch({
                type: RETRIEVEJS_PREFIX_ACTIONS + key + '/load',
                payload: {
                    isFetching: true,
                    failed: false,
                    data: null,
                },
            });
        };

        const resolver = (func: any, resolve: any, reject: any) => {
            dispatchLoading();
            func()
                .then((response: object) => {
                    dispatchSuccess(response);
                    resolve(response);
                })
                .catch((error: object) => {
                    dispatchFailed(error);
                    reject(error);
                });
        };

        return new Promise(((resolve, reject) => {
            switch (method) {
                case GET:
                    return resolver(() => {
                        return axiosInstance.get(path, config);
                    }, resolve, reject);
                case POST:
                    return resolver(() => {
                        return axiosInstance.post(path, params, config);
                    }, resolve, reject);
                case PUT:
                    return resolver(() => {
                        return axiosInstance.put(path, params, config);
                    }, resolve, reject);
                case DELETE:
                    return resolver(() => {
                        return axiosInstance.delete(path, config);
                    }, resolve, reject);
                case HEAD:
                    return resolver(() => {
                        return axiosInstance.head(path, config);
                    }, resolve, reject);
                case OPTIONS:
                    return resolver(() => {
                        return axiosInstance.options(path, config);
                    }, resolve, reject);
            }

        }));
    };

    const obj: Api = {};
    const requester = ({path, method}: ApiEndpoint, key: string) => {
        if (!path || !method) {
            errorLog('Api config validation failed, missing path and/or method key, expect things to break.');
        }
        obj[key] = async (params?, config?: AxiosRequestConfig) => {
            return baseFunction(method, path, key, params, config);
        };
    };

    for (const endpoint of Object.keys(endpoints)) {
        const val = endpoints[endpoint];
        requester(val, endpoint);
    }
    return obj;
};