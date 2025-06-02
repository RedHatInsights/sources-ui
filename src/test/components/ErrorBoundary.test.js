import { render, screen } from '@testing-library/react';

import ErrorBoundary from '../../components/ErrorBoundary';
import { componentWrapperIntl } from '../../utilities/testsHelpers';
import * as sentry from '@sentry/browser';

import mockStore from '../__mocks__/mockStore';
import notificationsStore from '../../utilities/notificationsStore';

describe('Error Boundary', () => {
  it('renders children', () => {
    const ChildrenComponent = () => <h1>Some content</h1>;

    render(
      componentWrapperIntl(
        <ErrorBoundary>
          <ChildrenComponent />
        </ErrorBoundary>,
      ),
    );

    expect(screen.getByText('Some content', { selector: 'h1' })).toBeInTheDocument();
  });

  it('dispatch message', () => {
    const SENTRY_ID = '2132s1ad5s1ad5sa1d51sfd321sa';
    sentry.captureException = jest.fn().mockImplementation(() => SENTRY_ID);
    const addNotificationSpy = jest.spyOn(notificationsStore, 'addNotification');

    const ERROR_TO_STRING = expect.any(String);
    const ERROR_STACK = expect.any(String);
    const tmpLog = console.error;

    console.error = jest.fn();

    const store = mockStore({});

    const ERROR = new Error('Something very wrong happenned');

    const ChildrenComponentError = () => {
      throw ERROR;
    };

    render(
      componentWrapperIntl(
        <ErrorBoundary>
          <ChildrenComponentError />
        </ErrorBoundary>,
        store,
      ),
    );

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(addNotificationSpy).toHaveBeenCalledWith({ title: ERROR_TO_STRING, variant: 'danger', description: ERROR_STACK });

    expect(addNotificationSpy.mock.calls[0][0].title.includes(ERROR.toString()));
    expect(addNotificationSpy.mock.calls[0][0].title.includes('Sentry ID'));
    expect(addNotificationSpy.mock.calls[0][0].title.includes(SENTRY_ID));

    expect(sentry.captureException).toHaveBeenCalledWith(ERROR);

    console.error = tmpLog;
  });
});
