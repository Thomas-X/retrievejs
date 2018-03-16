import React from "react";
import { warnLog } from './log';

export const query = (func, propName='query', requestConfig={}, params={}) => (WrappedComponent) => {
    class Query extends React.Component {

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

    return Query;
};