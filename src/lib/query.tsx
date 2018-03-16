import * as React from 'react';
import { warnLog } from './log';
import { ApiRequester } from './createApi';
import { AxiosRequestConfig } from 'axios';

export type QueryType = (func: ApiRequester, propName?: string, requestConfig?: AxiosRequestConfig, params?: object) => (WrappedComponent: React.SFC | React.ComponentClass)
    => React.SFC | React.ComponentClass;

/**
 * A query HOC for doing a request when the passed component is mounted.
 *
 * ### Example (es imports)
 * ```js
 * import { query } from 'retrievejs';
 * const enhance = query(api.getMockData, 'myRequest')
 * export const MyComponent = enhance((props) => <pre>{JSON.stringify(props, null, 4)}</pre>)
 * ```
 * ### Data structure passed to props
 * ```js
 * const MyComponent = (props) => {
 *      // props.myRequest.request
 *      //      => axios request object
 *      // props.myRequest.isFetching
 *      //      => whether or not we're currently fetching a resource
 *      // props.myRequest.failed
 *      //      => if the request failed, if yes, equals to true
 * }
 * ```
 * @param {ApiRequester} func
 * @param {string} propName
 * @param {{}} requestConfig
 * @param {{}} params
 * @return {(WrappedComponent) => QueryHOC}
 */

export const query: QueryType = (func: ApiRequester, propName='query', requestConfig={}, params={}) => (WrappedComponent) => {
    class QueryHOC extends React.Component<object, object> {

        state = {
            [propName]: {
                request: null,
                isFetching: false,
                failed: false,
            },
        };

        componentDidMount () {
            if(!func) {
                warnLog('Invalid function (1st param) passed to query');
            } else {
                func(requestConfig, params)
                    .then(response => {
                        this.setState({
                            [propName]: {
                                request: response,
                                isFetching: false,
                                failed: false,
                            },
                        });
                    })
                    .catch(error => {
                        this.setState({
                            [propName]: {
                                request: error,
                                isFetching: false,
                                failed: true,
                            },
                        });
                    });
                this.setState({
                    [propName] : {
                        request: null,
                        isFetching: true,
                        failed: false,
                    },
                });
            }
        }
        render () {
            const obj = {
                [propName]: this.state[propName],
            };
            return <WrappedComponent {...this.props} {...obj}/>;
        }
    }
    return QueryHOC;
};