import { ApiEndpoints } from './createApi';
import { AnyAction } from 'redux';


export type NetworkState = {
    readonly isFetching: boolean,
    readonly failed: boolean,
    readonly data: null | object
}

export default (api: ApiEndpoints) => {
    return (state: {} | NetworkState, action: AnyAction) => {
        const arr = action.type.split('/');

        // Validate that the action is from us
        const key = arr[2];
        if (arr[0] === 'retrievejs' && arr[1] === 'api' && Object.keys(api).includes(key)) {
            return {
                ...state,
                [key]: {
                    data: action.payload.data,
                    failed: action.payload.failed,
                    isFetching: action.payload.isFetching,
                }
            };
        }
        const obj: { [key: string]: NetworkState } = {};
        Object.keys(api).map((elem) => {
            obj[elem] = {
                data: null,
                failed: false,
                isFetching: false,
            }
        });
        return obj;
    };
}