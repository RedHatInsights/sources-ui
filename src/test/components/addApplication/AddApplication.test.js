import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Route, Routes } from 'react-router-dom';

import * as entities from '../../../api/entities';
import * as attachSource from '../../../api/doAttachApp';

import AddApplication from '../../../components/AddApplication/AddApplication';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypes, { AMAZON_TYPE, OPENSHIFT_TYPE } from '../../__mocks__/sourceTypes';
import { SOURCE_NO_APS_ID } from '../../__mocks__/sourcesData';
import appTypes, { COST_MANAGEMENT_APP } from '../../__mocks__/applicationTypes';
import { replaceRouteId, routes } from '../../../routes';
import reducer from '../../../components/AddApplication/reducer';
import * as removeAppSubmit from '../../../components/AddApplication/removeAppSubmit';

import mockStore from '../../__mocks__/mockStore';
import { act } from 'react-dom/test-utils';

describe('AddApplication', () => {
  let store;
  let initialEntry;
  let checkAvailabilitySource;

  beforeEach(() => {
    checkAvailabilitySource = jest.fn().mockImplementation(() => Promise.resolve());
    initialEntry = [
      replaceRouteId(routes.sourcesDetailAddApp.path, SOURCE_NO_APS_ID).replace(':app_type_id', COST_MANAGEMENT_APP.id),
    ];
    store = mockStore({
      sources: {
        entities: [
          {
            id: SOURCE_NO_APS_ID,
            source_type_id: OPENSHIFT_TYPE.id,
            applications: [],
          },
        ],
        appTypes,
        sourceTypes,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });
    entities.getSourcesApi = () => ({
      listEndpointAuthentications: jest.fn().mockImplementation(() => Promise.resolve({ data: [] })),
      checkAvailabilitySource,
    });
  });

  // FIXME: Fails while running with the rest of tests. Success individually
  it.skip('loads with endpoint values - not removing of source', async () => {
    const loadAuthsSpy = jest.fn().mockImplementation(() => Promise.resolve({ data: [] }));

    entities.getSourcesApi = () => ({
      listEndpointAuthentications: loadAuthsSpy,
    });

    const ENDPOINT_ID = '21312';

    store = mockStore({
      sources: {
        entities: [
          {
            id: SOURCE_NO_APS_ID,
            source_type_id: OPENSHIFT_TYPE.id,
            applications: [],
            endpoints: [{ id: ENDPOINT_ID }],
          },
        ],
        appTypes,
        sourceTypes,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText('Connect Cost Management')).toBeInTheDocument();
    expect(loadAuthsSpy).toHaveBeenCalledWith(ENDPOINT_ID);
  });

  it('renders loading state when is not loaded', async () => {
    store = mockStore({
      sources: {
        entities: [],
        appTypes,
        sourceTypes,
        appTypesLoaded: false,
        sourceTypesLoaded: true,
      },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    expect(screen.getByLabelText('Contents')).toBeInTheDocument();
    expect(screen.getByText('Loading, please wait.')).toBeInTheDocument();
  });

  describe('redirects', () => {
    const APP = {
      id: '1543897',
      name: 'custom-app',
      supported_source_types: [],
    };

    initialEntry = [replaceRouteId(routes.sourcesDetailAddApp.path, SOURCE_NO_APS_ID).replace(':app_type_id', APP.id)];

    it('when type does exist', async () => {
      store = mockStore({
        sources: {
          entities: [{ id: SOURCE_NO_APS_ID, source_type_id: AMAZON_TYPE.id, applications: [] }],
          appTypes: [],
          sourceTypes,
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          '/settings/integrations/' + replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID),
        ),
      );
    });

    it('when type does is not supported', async () => {
      store = mockStore({
        sources: {
          entities: [{ id: SOURCE_NO_APS_ID, source_type_id: AMAZON_TYPE.id, applications: [] }],
          appTypes: [APP],
          sourceTypes,
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          '/settings/integrations/' + replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID),
        ),
      );
    });

    it('when type is already attached', async () => {
      store = mockStore({
        sources: {
          entities: [
            { id: SOURCE_NO_APS_ID, source_type_id: AMAZON_TYPE.id, applications: [{ id: '234', application_type_id: APP.id }] },
          ],
          appTypes: [{ ...APP, supported_source_types: ['amazon'] }],
          sourceTypes,
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          '/settings/integrations/' + replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID),
        ),
      );
    });
  });

  describe('custom type - integration tests', () => {
    const customSourceType = {
      name: 'custom_type',
      product_name: 'Custom Type',
      id: '6844',
      schema: {
        authentication: [
          {
            type: 'receptor',
            name: 'receptor',
            fields: [
              {
                component: 'text-field',
                label: 'Another value',
                name: 'source.nested.another_value',
              },
              {
                component: 'text-field',
                label: 'Receptor ID',
                name: 'source.nested.source_ref',
              },
            ],
          },
        ],
        endpoint: {
          hidden: true,
          fields: [{ name: 'endpoint_id', hideField: true, component: 'text-field' }],
        },
      },
    };

    const application = {
      name: 'custom-app',
      display_name: 'Custom app',
      id: '15654165',
      supported_source_types: ['custom_type'],
      supported_authentication_types: { custom_type: ['receptor'] },
    };

    const another_value = 'do not remove this when retry';
    let source;

    beforeEach(async () => {
      source = {
        id: SOURCE_NO_APS_ID,
        source_type_id: customSourceType.id,
        applications: [],
        nested: {
          source_ref: 'original',
          another_value,
        },
      };

      store = mockStore({
        sources: {
          entities: [source],
          appTypes: [application],
          sourceTypes: [customSourceType],
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });

      initialEntry = [replaceRouteId(routes.sourcesDetailAddApp.path, SOURCE_NO_APS_ID).replace(':app_type_id', application.id)];

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());
    });

    it('closes immedietaly when no value is filled', async () => {
      const user = userEvent.setup();

      await act(async () => {
        await user.click(screen.getByLabelText('Close wizard'));
      });

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          replaceRouteId(`/settings/integrations/${routes.sourcesDetail.path}`, SOURCE_NO_APS_ID),
        ),
      );
    });

    it('opens a modal on cancel and closes the wizard', async () => {
      const user = userEvent.setup();

      const value = 'SOURCE_REF_CHANGED';

      await act(async () => {
        await user.clear(screen.getByRole('textbox', { name: 'Receptor ID' }));
      });
      await act(async () => {
        await user.type(screen.getByRole('textbox', { name: 'Receptor ID' }), value);
      });
      await act(async () => {
        await user.click(screen.getByLabelText('Close wizard'));
      });
      await act(async () => {
        await user.click(screen.getAllByText('Cancel')[1]);
      });

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          replaceRouteId(`/settings/integrations/${routes.sourcesDetail.path}`, SOURCE_NO_APS_ID),
        ),
      );
    });

    it('opens a modal on cancel and stay on the wizard', async () => {
      const user = userEvent.setup();

      const value = 'SOURCE_REF_CHANGED';

      await act(async () => {
        await user.clear(screen.getByRole('textbox', { name: 'Receptor ID' }));
      });
      await act(async () => {
        await user.type(screen.getByRole('textbox', { name: 'Receptor ID' }), value);
      });
      await act(async () => {
        await user.click(screen.getByLabelText('Close wizard'));
      });
      await act(async () => {
        await user.click(screen.getByText('Stay'));
      });

      expect(() => screen.getByText('Stay')).toThrow();
      expect(screen.getByRole('textbox', { name: 'Receptor ID' })).toHaveValue(value);
    });

    it('renders authentication selection', async () => {
      cleanup();

      const user = userEvent.setup();

      const authentication = {
        id: 'authid',
        authtype: 'receptor',
        username: 'customusername',
        password: 'somepassword',
      };

      entities.getSourcesApi = () => ({
        listEndpointAuthentications: jest.fn().mockImplementation(() =>
          Promise.resolve({
            data: [authentication],
          }),
        ),
        checkAvailabilitySource,
      });

      const application2 = {
        name: 'custom-app-second',
        display_name: 'Custom app second',
        id: '097JDS',
        supported_source_types: ['custom_type'],
        supported_authentication_types: { custom_type: ['receptor'] },
      };

      source = {
        ...source,
        endpoints: [{ id: '189298' }],
        applications: [
          {
            id: '87658787878586',
            application_type_id: application2.id,
            authentications: [
              {
                id: 'authid',
              },
            ],
          },
        ],
      };

      store = mockStore({
        sources: {
          entities: [source],
          appTypes: [application, application2],
          sourceTypes: [customSourceType],
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

      expect(screen.getAllByRole('radio')).toHaveLength(2);

      await act(async () => {
        await user.click(screen.getAllByRole('radio')[1]);
      });
      await act(async () => {
        await user.click(screen.getByText('Next'));
      });

      const value = 'SOURCE_REF_CHANGED';

      await act(async () => {
        await user.clear(screen.getByRole('textbox', { name: 'Receptor ID' }));
      });
      await act(async () => {
        await user.type(screen.getByRole('textbox', { name: 'Receptor ID' }), value);
      });
      await act(async () => {
        await user.click(screen.getByText('Next'));
      });

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));
      attachSource.doAttachApp = mockApi();

      await act(async () => {
        await user.click(screen.getByText('Add'));
      });

      expect(screen.getByText('Validating credentials')).toBeInTheDocument();

      attachSource.doAttachApp.resolve({
        availability_status: 'available',
      });

      await waitFor(() => expect(screen.getByText('Configuration successful')).toBeInTheDocument());

      expect(checkAvailabilitySource).toHaveBeenCalledWith(source.id);

      expect(attachSource.doAttachApp.mock.calls[0][1].getState().values).toEqual({
        application: { application_type_id: application.id },
        source: { ...source, nested: { source_ref: value, another_value } },
        authentication,
        selectedAuthentication: 'authid',
        url: undefined,
        endpoint: {
          id: '189298',
        },
      });
    }, 20000);
  });

  describe('imported source - not need to edit any value', () => {
    let initialValues;
    let source;

    beforeEach(() => {
      source = {
        id: SOURCE_NO_APS_ID,
        source_type_id: OPENSHIFT_TYPE.id,
        applications: [],
        imported: 'cfme',
      };

      store = mockStore({
        sources: {
          entities: [source],
          appTypes,
          sourceTypes,
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });
      initialValues = { application: undefined, source };
    });

    it('renders review', async () => {
      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      expect(screen.getByText('Review details', { selector: 'h1' })).toBeInTheDocument();
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('calls on submit function', async () => {
      const user = userEvent.setup();

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        }),
      );

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await act(async () => {
        await user.click(screen.getByText('Add'));
      });

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);

      await waitFor(() => expect(checkAvailabilitySource).toHaveBeenCalledWith(source.id));

      expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes);

      expect(screen.getByText('Configuration successful')).toBeInTheDocument();
      expect(screen.getByText('Your application was successfully added.')).toBeInTheDocument();
      expect(screen.getByText('Exit')).toBeInTheDocument();
    });

    it('shows aws specific step', async () => {
      const user = userEvent.setup();

      source = {
        ...source,
        source_type_id: AMAZON_TYPE.id,
      };

      store = mockStore({
        sources: {
          entities: [source],
          appTypes,
          sourceTypes,
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });
      initialValues = { application: undefined, source };

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        }),
      );

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await act(async () => {
        await user.click(screen.getByText('Add'));
      });

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);

      await waitFor(() => expect(checkAvailabilitySource).toHaveBeenCalledWith(source.id));

      expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes);

      expect(screen.getByText('Amazon Web Services connection established')).toBeInTheDocument();
      expect(
        screen.getByText('Discover the benefits of your connection or exit to manage your new integration.'),
      ).toBeInTheDocument();
      expect([...screen.getAllByRole('link')].map((l) => [l.textContent, l.href])).toEqual([
        ['View enabled AWS gold images', 'https://access.redhat.com/management/cloud'],
        ['Subscription Watch usage', 'http://localhost/preview/subscriptions'],
        ['Get started with Red Hat Insights', 'http://localhost/preview/insights'],
        ['Cost Management reporting', 'http://localhost/preview/cost-management'],
        ['Learn more about this Cloud', 'https://access.redhat.com/public-cloud/aws'],
      ]);
      expect(screen.getByText('Exit')).toBeInTheDocument();
    });

    it('renders timeouted step when endpoint', async () => {
      const user = userEvent.setup();

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          endpoint: [
            {
              availability_status: null,
            },
          ],
        }),
      );

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      await act(async () => {
        render(
          componentWrapperIntl(
            <Routes>
              <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
            </Routes>,
            store,
            initialEntry,
          ),
        );
      });

      await act(async () => {
        await user.click(screen.getByText('Add'));
      });

      await waitFor(() => expect(screen.getByText('Configuration in progress')).toBeInTheDocument());
      expect(
        screen.getByText(
          'We are still working to confirm credentials and app settings.To track progress, check the Status column in the Integrations table.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Exit')).toBeInTheDocument();
    });

    it('renders timeouted step', async () => {
      const user = userEvent.setup();

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          applications: [
            {
              availability_status: null,
            },
          ],
        }),
      );

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await act(async () => {
        await user.click(screen.getByText('Add'));
      });

      await waitFor(() => expect(screen.getByText('Configuration in progress')).toBeInTheDocument());
      expect(
        screen.getByText(
          'We are still working to confirm credentials and app settings.To track progress, check the Status column in the Integrations table.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Exit')).toBeInTheDocument();
    });

    it('redirects to edit when unavailable', async () => {
      const user = userEvent.setup();

      const ERROR = 'ARN is wrong';

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          applications: [
            {
              availability_status: 'unavailable',
              availability_status_error: ERROR,
            },
          ],
        }),
      );

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await act(async () => {
        await user.click(screen.getByText('Add'));
      });

      await waitFor(() => expect(attachSource.doAttachApp).toHaveBeenCalled());

      expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
      expect(screen.getByText('Edit integration')).toBeInTheDocument();
      expect(screen.getByText('Remove application')).toBeInTheDocument();

      await act(async () => {
        await user.click(screen.getByText('Edit integration'));
      });

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          replaceRouteId(`/settings/integrations/${routes.sourcesDetail.path}`, source.id),
        ),
      );
    });

    it('remove source when unavailable', async () => {
      const user = userEvent.setup();

      const ERROR = 'ARN is wrong';
      const APP_ID = 'some-id';

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: APP_ID,
          applications: [
            {
              availability_status: 'unavailable',
              availability_status_error: ERROR,
              id: APP_ID,
              application_type_id: '2',
            },
          ],
        }),
      );

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await act(async () => {
        await user.click(screen.getByText('Add'));
      });

      await waitFor(() => expect(attachSource.doAttachApp).toHaveBeenCalled());

      expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
      expect(screen.getByText('Edit integration')).toBeInTheDocument();
      expect(screen.getByText('Remove application')).toBeInTheDocument();

      removeAppSubmit.default = jest.fn().mockImplementation(() => Promise.resolve('OK'));

      expect(removeAppSubmit.default).not.toHaveBeenCalled();

      await act(async () => {
        await user.click(screen.getByText('Remove application'));
      });

      await waitFor(() =>
        expect(removeAppSubmit.default).toHaveBeenCalledWith(
          { id: APP_ID, display_name: 'Cost Management' },
          expect.objectContaining({ formatMessage: expect.any(Function) }), // intl
          undefined, // oncancel
          expect.any(Function), // dispatch
          expect.any(Object), // source
        ),
      );
    });

    it('catch errors after submit', async () => {
      const user = userEvent.setup();

      const ERROR_MESSAGE = 'Something went wrong :(';

      attachSource.doAttachApp = jest.fn().mockImplementation(() => new Promise((res, reject) => reject(ERROR_MESSAGE)));

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await act(async () => {
        await user.click(screen.getByText('Add'));
      });

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);

      await waitFor(() =>
        expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes),
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          'There was a problem while trying to add your source. Please try again. If the error persists, open a support case.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
      expect(screen.getByText('Open a support case')).toBeInTheDocument();
    });

    it('retry submit after fail', async () => {
      const user = userEvent.setup();

      const ERROR_MESSAGE = 'Something went wrong :(';

      attachSource.doAttachApp = jest.fn().mockImplementation(() => new Promise((res, reject) => reject(ERROR_MESSAGE)));

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailAddApp.path} element={<AddApplication />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );

      await act(async () => {
        await user.click(screen.getByText('Add'));
      });

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);

      await waitFor(() =>
        expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes),
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      attachSource.doAttachApp.mockReset();

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        }),
      );

      await act(async () => {
        await user.click(screen.getByText('Retry'));
      });

      await waitFor(() => expect(screen.getByText('Configuration successful')).toBeInTheDocument());
    });
  });

  describe('reducer', () => {
    it('default', () => {
      expect(reducer({ progressStep: 3 }, {})).toEqual({ progressStep: 3 });
    });
  });
});
