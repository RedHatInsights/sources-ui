/* eslint-disable no-console */
import ErrorBoundary from '../../components/ErrorBoundary';
import { componentWrapperIntl } from '../../Utilities/testsHelpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as sentry from '@sentry/browser';

import * as actions from '../../redux/actions/sources';

describe('Error Boundary', () => {
    it('renders children', () => {
        const ChildrenComponent = () => <h1>Some content</h1>;

        const wrapper = mount(componentWrapperIntl(<ErrorBoundary><ChildrenComponent /></ErrorBoundary>));

        expect(wrapper.find(ChildrenComponent)).toHaveLength(1);
    });

    it('dispatch message', () => {
        const SENTRY_ID = '2132s1ad5s1ad5sa1d51sfd321sa';
        sentry.captureException = jest.fn().mockImplementation(() => SENTRY_ID);

        const ERROR_TO_STRING = expect.any(String);
        const ERROR_STACK = expect.any(String);
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
            ERROR_TO_STRING,
            'danger',
            ERROR_STACK
        );

        expect(actions.addMessage.mock.calls[0][0].includes(ERROR.toString()));
        expect(actions.addMessage.mock.calls[0][0].includes('Sentry ID'));
        expect(actions.addMessage.mock.calls[0][0].includes(SENTRY_ID));

        expect(sentry.captureException).toHaveBeenCalledWith(ERROR);

        console.error = tmpLog;
    });
});
