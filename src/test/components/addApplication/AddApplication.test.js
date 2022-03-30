import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Route } from 'react-router-dom';

import * as entities from '../../../api/entities';
import * as attachSource from '../../../api/doAttachApp';

import AddApplication from '../../../components/AddApplication/AddApplication';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { sourceTypesData, OPENSHIFT_ID, AMAZON_ID } from '../../__mocks__/sourceTypesData';
import { SOURCE_NO_APS_ID } from '../../__mocks__/sourcesData';
import { applicationTypesData, COSTMANAGEMENT_APP } from '../../__mocks__/applicationTypesData';
import { routes, replaceRouteId } from '../../../Routes';
import reducer from '../../../components/AddApplication/reducer';
import * as removeAppSubmit from '../../../components/AddApplication/removeAppSubmit';

import mockStore from '../../__mocks__/mockStore';

describe('AddApplication', () => {
  let store;
  let initialEntry;
  let checkAvailabilitySource;

  beforeEach(() => {
    checkAvailabilitySource = jest.fn().mockImplementation(() => Promise.resolve());
    initialEntry = [
      replaceRouteId(routes.sourcesDetailAddApp.path, SOURCE_NO_APS_ID).replace(':app_type_id', COSTMANAGEMENT_APP.id),
    ];
    store = mockStore({
      sources: {
        entities: [
          {
            id: SOURCE_NO_APS_ID,
            source_type_id: OPENSHIFT_ID,
            applications: [],
          },
        ],
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
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

  it('loads with endpoint values - not removing of source', async () => {
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
            source_type_id: OPENSHIFT_ID,
            applications: [],
            endpoints: [{ id: ENDPOINT_ID }],
          },
        ],
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText('Connect Cost Management')).toBeInTheDocument();
    expect(loadAuthsSpy).toHaveBeenCalledWith(ENDPOINT_ID);
  });

  it('renders loading state when is not loaded', async () => {
    store = mockStore({
      sources: {
        entities: [],
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
        appTypesLoaded: false,
        sourceTypesLoaded: true,
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
        store,
        initialEntry
      )
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
          entities: [{ id: SOURCE_NO_APS_ID, source_type_id: AMAZON_ID, applications: [] }],
          appTypes: [],
          sourceTypes: sourceTypesData.data,
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
        )
      );
    });

    it('when type does is not supported', async () => {
      store = mockStore({
        sources: {
          entities: [{ id: SOURCE_NO_APS_ID, source_type_id: AMAZON_ID, applications: [] }],
          appTypes: [APP],
          sourceTypes: sourceTypesData.data,
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
        )
      );
    });

    it('when type is already attached', async () => {
      store = mockStore({
        sources: {
          entities: [
            { id: SOURCE_NO_APS_ID, source_type_id: AMAZON_ID, applications: [{ id: '234', application_type_id: APP.id }] },
          ],
          appTypes: [{ ...APP, supported_source_types: ['amazon'] }],
          sourceTypes: sourceTypesData.data,
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
        )
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
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());
    });

    it('closes immedietaly when no value is filled', async () => {
      userEvent.click(screen.getByLabelText('Close wizard'));

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
        )
      );
    });

    it('opens a modal on cancel and closes the wizard', async () => {
      const value = 'SOURCE_REF_CHANGED';

      userEvent.type(screen.getByRole('textbox', { name: 'Receptor ID' }), `{selectall}{backspace}${value}`);
      userEvent.click(screen.getByLabelText('Close wizard'));
      userEvent.click(screen.getByText('Exit'));

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(
          replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
        )
      );
    });

    it('opens a modal on cancel and stay on the wizard', async () => {
      const value = 'SOURCE_REF_CHANGED';

      userEvent.type(screen.getByRole('textbox', { name: 'Receptor ID' }), `{selectall}{backspace}${value}`);
      userEvent.click(screen.getByLabelText('Close wizard'));
      userEvent.click(screen.getByText('Stay'));

      expect(() => screen.getByText('Stay')).toThrow();
      expect(screen.getByRole('textbox', { name: 'Receptor ID' })).toHaveValue(value);
    });

    it('renders authentication selection', async () => {
      cleanup();

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
          })
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
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

      expect(screen.getAllByRole('radio')).toHaveLength(2);

      userEvent.click(screen.getAllByRole('radio')[1]);
      userEvent.click(screen.getByText('Next'));

      const value = 'SOURCE_REF_CHANGED';

      userEvent.type(screen.getByRole('textbox', { name: 'Receptor ID' }), `{selectall}{backspace}${value}`);
      userEvent.click(screen.getByText('Next'));

      entities.doLoadEntities = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ sources: [], sources_aggregate: { aggregate: { total_count: 0 } } }));
      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        })
      );

      userEvent.click(screen.getByText('Add'));

      expect(screen.getByText('Validating credentials')).toBeInTheDocument();

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
    });
  });

  describe('imported source - not need to edit any value', () => {
    let initialValues;
    let source;

    beforeEach(() => {
      source = {
        id: SOURCE_NO_APS_ID,
        source_type_id: OPENSHIFT_ID,
        applications: [],
        imported: 'cfme',
      };

      store = mockStore({
        sources: {
          entities: [source],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
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
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      expect(screen.getByText('Review details', { selector: 'h1' })).toBeInTheDocument();
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('calls on submit function', async () => {
      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        })
      );

      entities.doLoadEntities = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ sources: [], sources_aggregate: { aggregate: { total_count: 0 } } }));

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      userEvent.click(screen.getByText('Add'));

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);
      const appTypes = expect.any(Array);

      await waitFor(() => expect(checkAvailabilitySource).toHaveBeenCalledWith(source.id));

      expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes);

      expect(screen.getByText('Configuration successful')).toBeInTheDocument();
      expect(screen.getByText('Your application was successfully added.')).toBeInTheDocument();
      expect(screen.getByText('Exit')).toBeInTheDocument();
    });

    it('shows aws specific step', async () => {
      source = {
        ...source,
        source_type_id: AMAZON_ID,
      };

      store = mockStore({
        sources: {
          entities: [source],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
          appTypesLoaded: true,
          sourceTypesLoaded: true,
          loaded: 0,
        },
      });
      initialValues = { application: undefined, source };

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        })
      );

      entities.doLoadEntities = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ sources: [], sources_aggregate: { aggregate: { total_count: 0 } } }));

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      userEvent.click(screen.getByText('Add'));

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);
      const appTypes = expect.any(Array);

      await waitFor(() => expect(checkAvailabilitySource).toHaveBeenCalledWith(source.id));

      expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes);

      expect(screen.getByText('Amazon Web Services connection established')).toBeInTheDocument();
      expect(screen.getByText('Discover the benefits of your connection or exit to manage your new source.')).toBeInTheDocument();
      expect([...screen.getAllByRole('link')].map((l) => [l.textContent, l.href])).toEqual([
        ['View enabled AWS gold images', 'https://access.redhat.com/management/cloud'],
        ['Subscription Watch usage', 'http://localhost/beta/subscriptions'],
        ['Get started with Red Hat Insights', 'http://localhost/beta/insights'],
        ['Cost Management reporting', 'http://localhost/beta/cost-management'],
        ['Learn more about this Cloud', 'https://access.redhat.com/public-cloud/aws'],
      ]);
      expect(screen.getByText('Exit')).toBeInTheDocument();
    });

    it('renders timeouted step when endpoint', async () => {
      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          endpoint: [
            {
              availability_status: null,
            },
          ],
        })
      );

      entities.doLoadEntities = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ sources: [], sources_aggregate: { aggregate: { total_count: 0 } } }));

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      userEvent.click(screen.getByText('Add'));

      await waitFor(() => expect(screen.getByText('Configuration in progress')).toBeInTheDocument());
      expect(
        screen.getByText(
          'We are still working to confirm credentials and app settings.To track progress, check the Status column in the Sources table.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Exit')).toBeInTheDocument();
    });

    it('renders timeouted step', async () => {
      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          applications: [
            {
              availability_status: null,
            },
          ],
        })
      );

      entities.doLoadEntities = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ sources: [], sources_aggregate: { aggregate: { total_count: 0 } } }));

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      userEvent.click(screen.getByText('Add'));

      await waitFor(() => expect(screen.getByText('Configuration in progress')).toBeInTheDocument());
      expect(
        screen.getByText(
          'We are still working to confirm credentials and app settings.To track progress, check the Status column in the Sources table.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Exit')).toBeInTheDocument();
    });

    it('redirects to edit when unavailable', async () => {
      const ERROR = 'ARN is wrong';

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          applications: [
            {
              availability_status: 'unavailable',
              availability_status_error: ERROR,
            },
          ],
        })
      );

      entities.doLoadEntities = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ sources: [], sources_aggregate: { aggregate: { total_count: 0 } } }));

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      userEvent.click(screen.getByText('Add'));

      await waitFor(() => expect(attachSource.doAttachApp).toHaveBeenCalled());

      expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
      expect(screen.getByText('Edit source')).toBeInTheDocument();
      expect(screen.getByText('Remove application')).toBeInTheDocument();

      userEvent.click(screen.getByText('Edit source'));

      await waitFor(() =>
        expect(screen.getByTestId('location-display').textContent).toEqual(replaceRouteId(routes.sourcesDetail.path, source.id))
      );
    });

    it('remove source when unavailable', async () => {
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
        })
      );

      entities.doLoadEntities = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ sources: [], sources_aggregate: { aggregate: { total_count: 0 } } }));

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      userEvent.click(screen.getByText('Add'));

      await waitFor(() => expect(attachSource.doAttachApp).toHaveBeenCalled());

      expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
      expect(screen.getByText('Edit source')).toBeInTheDocument();
      expect(screen.getByText('Remove application')).toBeInTheDocument();

      removeAppSubmit.default = jest.fn().mockImplementation(() => Promise.resolve('OK'));

      expect(removeAppSubmit.default).not.toHaveBeenCalled();

      userEvent.click(screen.getByText('Remove application'));

      await waitFor(() =>
        expect(removeAppSubmit.default).toHaveBeenCalledWith(
          { id: APP_ID, display_name: 'Cost Management' },
          expect.objectContaining({ formatMessage: expect.any(Function) }), // intl
          undefined, // oncancel
          expect.any(Function), // dispatch
          expect.any(Object) // source
        )
      );
    });

    it('catch errors after submit', async () => {
      const ERROR_MESSAGE = 'Something went wrong :(';

      attachSource.doAttachApp = jest.fn().mockImplementation(() => new Promise((res, reject) => reject(ERROR_MESSAGE)));

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      userEvent.click(screen.getByText('Add'));

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);
      const appTypes = expect.any(Array);

      await waitFor(() =>
        expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes)
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          'There was a problem while trying to add your source. Please try again. If the error persists, open a support case.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
      expect(screen.getByText('Open a support case')).toBeInTheDocument();
    });

    it('retry submit after fail', async () => {
      const ERROR_MESSAGE = 'Something went wrong :(';

      attachSource.doAttachApp = jest.fn().mockImplementation(() => new Promise((res, reject) => reject(ERROR_MESSAGE)));

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      userEvent.click(screen.getByText('Add'));

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);
      const appTypes = expect.any(Array);

      await waitFor(() =>
        expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes)
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      attachSource.doAttachApp.mockReset();

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        })
      );

      userEvent.click(screen.getByText('Retry'));

      await waitFor(() => expect(screen.getByText('Configuration successful')).toBeInTheDocument());
    });
  });

  describe('reducer', () => {
    it('default', () => {
      expect(reducer({ progressStep: 3 }, {})).toEqual({ progressStep: 3 });
    });
  });
});
