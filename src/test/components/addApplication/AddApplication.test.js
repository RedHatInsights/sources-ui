import React from 'react';
import { mount } from 'enzyme';

import { EmptyStateBody, EmptyStateSecondaryActions, Title, Radio } from '@patternfly/react-core';

import { Route, MemoryRouter } from 'react-router-dom';

import CloseModal from '../../../components/CloseModal';
import SummaryStep from '../../../components/FormComponents/SourceWizardSummary';
import LoadingStep from '../../../components/steps/LoadingStep';
import FinishedStep from '../../../components/steps/FinishedStep';
import AmazonFinishedStep from '../../../components/steps/AmazonFinishedStep';
import TimeoutStep from '../../../components/steps/TimeoutStep';
import ErroredStep from '../../../components/steps/ErroredStep';

import { act } from 'react-dom/test-utils';

import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import * as entities from '../../../api/entities';
import * as attachSource from '../../../api/doAttachApp';

import AddApplication from '../../../components/AddApplication/AddApplication';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { sourceTypesData, OPENSHIFT_ID, AMAZON_ID } from '../../__mocks__/sourceTypesData';
import { SOURCE_NO_APS_ID } from '../../__mocks__/sourcesData';
import { applicationTypesData, COSTMANAGEMENT_APP } from '../../__mocks__/applicationTypesData';
import { routes, replaceRouteId } from '../../../Routes';
import { AuthTypeSetter } from '../../../components/AddApplication/AuthTypeSetter';
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

    let wrapper;

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(loadAuthsSpy).toHaveBeenCalledWith(ENDPOINT_ID);
    expect(wrapper.find(SourcesFormRenderer).length).toEqual(1);
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

    let wrapper;

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(LoadingStep)).toHaveLength(1);
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

      let wrapper;

      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
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

      let wrapper;

      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
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

      let wrapper;

      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
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

    let wrapper;
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

      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();
    });

    it('closes immedietaly when no value is filled', async () => {
      await act(async () => {
        const closeButton = wrapper.find('Button').at(0);
        closeButton.simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
      );
    });

    it('opens a modal on cancel and closes the wizard', async () => {
      const value = 'SOURCE_REF_CHANGED';

      await act(async () => {
        const sourceRefInput = wrapper.find('input[name="source.nested.source_ref"]');
        sourceRefInput.instance().value = value;
        sourceRefInput.simulate('change');
      });
      wrapper.update();

      await act(async () => {
        const closeButton = wrapper.find('Button').at(0);
        closeButton.simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(CloseModal)).toHaveLength(1);

      await act(async () => {
        const leaveButton = wrapper.find('Button').at(1);
        leaveButton.simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetail.path, SOURCE_NO_APS_ID)
      );
    });

    it('opens a modal on cancel and stay on the wizard', async () => {
      const value = 'SOURCE_REF_CHANGED';

      await act(async () => {
        const sourceRefInput = wrapper.find('input[name="source.nested.source_ref"]');
        sourceRefInput.instance().value = value;
        sourceRefInput.simulate('change');
      });
      wrapper.update();

      await act(async () => {
        const closeButton = wrapper.find('Button').at(0);
        closeButton.simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(CloseModal)).toHaveLength(1);

      await act(async () => {
        const stayButton = wrapper.find('Button').at(0);
        stayButton.simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(CloseModal)).toHaveLength(0);
      expect(wrapper.find('input[name="source.nested.source_ref"]').instance().value).toEqual(value);
    });

    it('renders authentication selection', async () => {
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

      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(Radio)).toHaveLength(2);
      expect(wrapper.find(AuthTypeSetter)).toHaveLength(1);

      await act(async () => {
        const selectExistingAuth = wrapper.find('input').at(1);
        selectExistingAuth.simulate('change');
      });
      wrapper.update();

      await act(async () => {
        const nextButton = wrapper.find('Button').at(1);
        nextButton.simulate('click');
      });
      wrapper.update();

      const value = 'SOURCE_REF_CHANGED';

      await act(async () => {
        const sourceRefInput = wrapper.find('input[name="source.nested.source_ref"]');
        sourceRefInput.instance().value = value;
        sourceRefInput.simulate('change');
      });
      wrapper.update();

      await act(async () => {
        const nextButton = wrapper.find('Button').at(1);
        nextButton.simulate('click');
      });
      wrapper.update();

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
      entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));
      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        })
      );

      await act(async () => {
        const submitButton = wrapper.find('Button').at(1);
        submitButton.simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(FinishedStep)).toHaveLength(1);

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
      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      expect(wrapper.find(SummaryStep)).toHaveLength(1);
      expect(wrapper.find('Button').at(1).text()).toEqual('Add');
    });

    it('calls on submit function', async () => {
      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        })
      );

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
      entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      wrapper.update();

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);
      const appTypes = expect.any(Array);

      expect(checkAvailabilitySource).toHaveBeenCalledWith(source.id);

      expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes);
      expect(wrapper.find(FinishedStep).length).toEqual(1);
      expect(wrapper.find(Title).last().text()).toEqual('Configuration successful');
      expect(wrapper.find(EmptyStateBody).last().text()).toEqual('Your application was successfully added.');
      expect(wrapper.find('Button').at(1).text()).toEqual('Exit');
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

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
      entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      wrapper.update();

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);
      const appTypes = expect.any(Array);

      expect(checkAvailabilitySource).toHaveBeenCalledWith(source.id);

      expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes);
      expect(wrapper.find(AmazonFinishedStep).length).toEqual(1);
      expect(wrapper.find(Title).last().text()).toEqual('Amazon Web Services connection established');
      expect(wrapper.find(EmptyStateBody).last().text()).toEqual(
        'Discover the benefits of your connection or exit to manage your new source.View enabled AWS Gold imagesSubscription Watch usageGet started with Red Hat InsightsCost Management reporting'
      );
      expect(wrapper.find('Button').at(1).text()).toEqual('Exit');
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

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
      entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(TimeoutStep)).toHaveLength(1);
      expect(wrapper.find(Title).last().text()).toEqual('Configuration in progress');
      expect(wrapper.find(EmptyStateBody).last().text()).toEqual(
        'We are still working to confirm credentials and app settings.To track progress, check the Status column in the Sources table.'
      );
      expect(wrapper.find('Button').at(1).text()).toEqual('Exit');
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

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
      entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(TimeoutStep)).toHaveLength(1);
      expect(wrapper.find(Title).last().text()).toEqual('Configuration in progress');
      expect(wrapper.find(EmptyStateBody).last().text()).toEqual(
        'We are still working to confirm credentials and app settings.To track progress, check the Status column in the Sources table.'
      );
      expect(wrapper.find('Button').at(1).text()).toEqual('Exit');
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

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
      entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      wrapper.update();

      expect(attachSource.doAttachApp).toHaveBeenCalled();

      expect(wrapper.find(ErroredStep).length).toEqual(1);
      expect(wrapper.find(Title).last().text()).toEqual('Configuration unsuccessful');
      expect(wrapper.find(EmptyStateBody).last().text()).toEqual(ERROR);
      expect(wrapper.find('Button').at(1).text()).toEqual('Edit source');
      expect(wrapper.find('Button').at(2).text()).toEqual('Remove application');

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click', { button: 0 });
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetail.path, source.id)
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
            },
          ],
        })
      );

      entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
      entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      wrapper.update();

      expect(attachSource.doAttachApp).toHaveBeenCalled();

      expect(wrapper.find(ErroredStep).length).toEqual(1);
      expect(wrapper.find(Title).last().text()).toEqual('Configuration unsuccessful');
      expect(wrapper.find(EmptyStateBody).last().text()).toEqual(ERROR);
      expect(wrapper.find('Button').at(1).text()).toEqual('Edit source');
      expect(wrapper.find('Button').at(2).text()).toEqual('Remove application');

      removeAppSubmit.default = jest.fn().mockImplementation(() => Promise.resolve('OK'));

      expect(removeAppSubmit.default).not.toHaveBeenCalled();

      await act(async () => {
        wrapper.find('Button').at(2).simulate('click');
      });
      wrapper.update();

      expect(removeAppSubmit.default).toHaveBeenCalledWith(
        { id: APP_ID, display_name: undefined },
        expect.objectContaining({ formatMessage: expect.any(Function) }), // intl
        undefined, // oncancel
        expect.any(Function), // dispatch
        expect.any(Object) // source
      );
    });

    it('catch errors after submit', async () => {
      const ERROR_MESSAGE = 'Something went wrong :(';

      attachSource.doAttachApp = jest.fn().mockImplementation(() => new Promise((res, reject) => reject(ERROR_MESSAGE)));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      wrapper.update();

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);
      const appTypes = expect.any(Array);

      expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes);

      expect(wrapper.find(ErroredStep)).toHaveLength(1);
      expect(wrapper.find(Title).last().text()).toEqual('Something went wrong');
      expect(wrapper.find(EmptyStateBody).last().text()).toEqual(
        'There was a problem while trying to add your source. Please try again. If the error persists, open a support case.'
      );
      expect(wrapper.find('Button').at(1).text()).toEqual('Retry');
      expect(wrapper.find(EmptyStateSecondaryActions).text()).toEqual('Open a support case');
    });

    it('retry submit after fail', async () => {
      const ERROR_MESSAGE = 'Something went wrong :(';

      attachSource.doAttachApp = jest.fn().mockImplementation(() => new Promise((res, reject) => reject(ERROR_MESSAGE)));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      wrapper.update();

      const formValues = {
        application: {
          application_type_id: '2',
        },
      };
      const formApi = expect.any(Object);
      const authenticationValues = expect.any(Array);
      const appTypes = expect.any(Array);

      expect(attachSource.doAttachApp).toHaveBeenCalledWith(formValues, formApi, authenticationValues, initialValues, appTypes);

      expect(wrapper.find(ErroredStep)).toHaveLength(1);

      attachSource.doAttachApp.mockReset();

      attachSource.doAttachApp = jest.fn().mockImplementation(() =>
        Promise.resolve({
          availability_status: 'available',
        })
      );

      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(FinishedStep)).toHaveLength(1);
    });

    it('show loading step', async () => {
      attachSource.doAttachApp = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('ok'), 2)));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailAddApp.path} render={(...args) => <AddApplication {...args} />} />,
          store,
          initialEntry
        )
      );

      jest.useFakeTimers();
      await act(async () => {
        wrapper.find('Button').at(1).simulate('click');
      });
      jest.useRealTimers();

      wrapper.update();

      expect(wrapper.find(LoadingStep).length).toEqual(1);
    });
  });

  describe('reducer', () => {
    it('default', () => {
      expect(reducer({ progressStep: 3 }, {})).toEqual({ progressStep: 3 });
    });
  });
});
