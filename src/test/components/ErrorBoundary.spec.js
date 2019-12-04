/* eslint-disable no-console */
import ErrorBoundary from '../../components/ErrorBoundary';
import { componentWrapperIntl } from '../../Utilities/testsHelpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../redux/actions/providers';

describe('Error Boundary', () => {
    it('renders children', () => {
        const ChildrenComponent = () => <h1>Some content</h1>;

        const wrapper = mount(componentWrapperIntl(<ErrorBoundary><ChildrenComponent /></ErrorBoundary>));

        expect(wrapper.find(ChildrenComponent)).toHaveLength(1);
    });

    it('dispatch message', () => {
        const COMPONENT_STACK = expect.any(String);
        const tmpLog = console.error;

        console.error = jest.fn();

        const middlewares = [thunk];

        const mockStore = configureStore(middlewares);
        const store = mockStore({});

        const ERROR = new Error('Something very wrong happenned');

        const ChildrenComponentError = () => {
            throw ERROR;
        };

        actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'type' }));

        const wrapper = mount(componentWrapperIntl(<ErrorBoundary><ChildrenComponentError /></ErrorBoundary>, store));

        expect(wrapper.text()).toEqual('Error occurred');
        expect(actions.addMessage).toHaveBeenCalledWith(
            ERROR.toString(),
            'danger',
            COMPONENT_STACK
        );

        console.error = tmpLog;
    });
});
