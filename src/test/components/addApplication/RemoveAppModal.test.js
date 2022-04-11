import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Route } from 'react-router-dom';

import RemoveAppModal from '../../../components/AddApplication/RemoveAppModal';
import * as actions from '../../../redux/sources/actions';
import { routes, replaceRouteId } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';

describe('RemoveAppModal', () => {
  let store;
  let initialEntry;
  let initialStore;

  const APP_ID = '187894151315';
  const APP2_ID = '18789sadsa4151315';
  const SOURCE_ID = '15';
  const SUCCESS_MSG = expect.any(String);
  const ERROR_MSG = expect.any(String);

  const APP1 = 'APP_1';
  const APP2 = 'APP_2';
  const APP1_DISPLAY_NAME = 'APP_1';
  const APP2_DISPLAY_NAME = 'APP_2';

  const APP_TYPES = [
    {
      id: 1,
      display_name: APP1_DISPLAY_NAME,
      name: APP1,
      dependent_applications: [],
    },
    {
      id: 2,
      name: APP2,
      display_name: APP2_DISPLAY_NAME,
      dependent_applications: [APP1],
    },
  ];

  beforeEach(() => {
    initialStore = {
      sources: {
        appTypes: APP_TYPES,
        entities: [{ id: SOURCE_ID, applications: [{ id: APP_ID, application_type_id: 1 }] }],
      },
    };
    store = mockStore(initialStore);
    initialEntry = [replaceRouteId(routes.sourcesDetailRemoveApp.path, SOURCE_ID).replace(':app_id', APP_ID)];
  });

  it('renders correctly', () => {
    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailRemoveApp.path} render={(...args) => <RemoveAppModal {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(screen.getByText('Remove application?')).toBeInTheDocument();
    expect(screen.getByText('Remove')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText(APP1_DISPLAY_NAME, { selector: 'b' })).toBeInTheDocument();
    expect(screen.getByText('will be disconnected from this source.', { exact: false })).toBeInTheDocument();
  });

  it('redirect when app does not exist', async () => {
    initialStore = {
      sources: {
        appTypes: APP_TYPES,
        entities: [{ id: SOURCE_ID, applications: [] }],
      },
    };
    store = mockStore(initialStore);

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailRemoveApp.path} render={(...args) => <RemoveAppModal {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() =>
      expect(screen.getByTestId('location-display').textContent).toEqual(replaceRouteId(routes.sourcesDetail.path, SOURCE_ID))
    );
  });

  it('renders correctly with attached dependent applications', () => {
    initialEntry = [replaceRouteId(routes.sourcesDetailRemoveApp.path, SOURCE_ID).replace(':app_id', APP2_ID)];
    store = mockStore({
      sources: {
        ...initialStore.sources,
        entities: [
          {
            id: SOURCE_ID,
            applications: [
              { id: APP_ID, application_type_id: 1 },
              { id: APP2_ID, application_type_id: 2 },
            ],
          },
        ],
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailRemoveApp.path} render={(...args) => <RemoveAppModal {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(screen.getByText('This change will affect these applications: ', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(APP1_DISPLAY_NAME, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(APP2_DISPLAY_NAME, { selector: 'b' })).toBeInTheDocument();
  });

  it('renders correctly with unattached dependent applications', () => {
    initialEntry = [replaceRouteId(routes.sourcesDetailRemoveApp.path, SOURCE_ID).replace(':app_id', APP2_ID)];
    store = mockStore({
      sources: {
        ...initialStore.sources,
        entities: [
          {
            id: SOURCE_ID,
            applications: [{ id: APP2_ID, application_type_id: 2 }],
          },
        ],
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailRemoveApp.path} render={(...args) => <RemoveAppModal {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(() => screen.getByText(APP1_DISPLAY_NAME, { exact: false })).toThrow();
    expect(screen.getByText(APP2_DISPLAY_NAME, { selector: 'b' })).toBeInTheDocument();
  });

  it('calls cancel', async () => {
    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailRemoveApp.path} render={(...args) => <RemoveAppModal {...args} />} />,
        store,
        initialEntry
      )
    );

    await userEvent.click(screen.getByText('Cancel'));

    expect(screen.getByTestId('location-display').textContent).toEqual(replaceRouteId(routes.sourcesDetail.path, SOURCE_ID));
  });

  it('calls a submit', async () => {
    actions.removeApplication = jest.fn().mockImplementation(() => ({ type: 'REMOVE_APP' }));

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailRemoveApp.path} render={(...args) => <RemoveAppModal {...args} />} />,
        store,
        initialEntry
      )
    );

    await userEvent.click(screen.getByText('Remove'));

    await waitFor(() => expect(actions.removeApplication).toHaveBeenCalledWith(APP_ID, SOURCE_ID, SUCCESS_MSG, ERROR_MSG));
  });
});
