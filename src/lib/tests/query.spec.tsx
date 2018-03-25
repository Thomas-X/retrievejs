import test from 'ava';
import { spy } from 'sinon';

// React enzyme/jsdom boilerplates
import 'jsdom-global/register';
import * as React from 'react';
import { configure, mount } from 'enzyme';
// @ts-ignore
import Adapter from 'enzyme-adapter-react-16';
import { createApi } from '../createApi';
import { query } from '../query';
import { createStore } from 'redux';
// @ts-ignore
configure({adapter: new Adapter()});

test('it queries', t => {
    const endpoints = {
        getMock: {path: 'http://www.mocky.io/v2/5aab93182e00004900138dd4', method: 'get'},
    };
    const store = createStore((state: any) => state);
    const api = createApi(endpoints, store);


    const didMount = spy();

    class Test extends React.Component<object, object> {
        constructor(props: any) {
            super(props);
            this.componentDidMount = didMount;
        }
        public render() {
            return (
                <div>
                    hi
                </div>
            );
        }
    }

    const MyComponent = query(api.getMock, 'myRequest')(Test);

    const wrapper = mount(<MyComponent/>);
    t.is(didMount.callCount, 1);
    // @ts-ignore
    t.is(wrapper.find('Test').props().myRequest.isFetching, true);
});