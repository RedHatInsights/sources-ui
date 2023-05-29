import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';

import * as utilsHelpers from '@redhat-cloud-services/frontend-components-utilities/helpers/helpers';

import SourcesPageOriginal from '../../pages/Sources';

import { SOURCE_ALL_APS_ID, sourcesDataGraphQl } from '../__mocks__/sourcesData';
import sourceTypes, { AMAZON_TYPE } from '../__mocks__/sourceTypes';
import applicationTypes, { COST_MANAGEMENT_APP } from '../__mocks__/applicationTypes';

import { componentWrapperIntl } from '../../utilities/testsHelpers';

import { defaultSourcesState } from '../../redux/sources/reducer';
import * as api from '../../api/entities';
import * as typesApi from '../../api/source_types';
import { replaceRouteId, routes } from '../../Routing';
import * as helpers from '../../pages/Sources/helpers';
import * as SourceRemoveModal from '../../components/SourceRemoveModal/SourceRemoveModal';
import * as urlQuery from '../../utilities/urlQuery';

import DataLoader from '../../components/DataLoader';
import ElementWrapper from '../../components/ElementWrapper/ElementWrapper';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../utilities/constants';
import { getStore } from '../../utilities/store';
import { AVAILABLE, UNAVAILABLE } from '../../views/formatters';
import * as AddSourceWizard from '../../components/addSourceWizard';
import { CSV_FILE, JSON_FILE_STRING } from '../__mocks__/fileMocks';

jest.mock('../../utilities/utils.js', () => {
  const actual = jest.requireActual('../../utilities/utils.js');
  return {
    __esModule: true,
    ...actual,
    mergeToBasename: (to) => to,
  };
});
jest.mock('@redhat-cloud-services/frontend-components/useScreenSize', () => ({
  __esModule: true,
  isSmallScreen: (size) => size === 'sm',
  useScreenSize: () => global.mockWidth || 'md',
}));

jest.mock('react', () => {
  const React = jest.requireActual('react');
  const Suspense = ({ children }) => {
    return children;
  };

  const lazy = jest.fn().mockImplementation((fn) => {
    const Component = (props) => {
      const [C, setC] = React.useState();
      const mounted = React.useRef(true);

      React.useEffect(() => {
        fn().then((v) => {
          mounted.current && setC(v);
        });

        return () => {
          mounted.current = false;
        };
      }, []);

      return C ? <C.default {...props} /> : null;
    };

    return Component;
  });

  return {
    ...React,
    lazy,
    Suspense,
  };
});

describe('SourcesPage', () => {
  let initialProps;
  let store;

  const SourcesPage = (props) => (
    <React.Fragment>
      <DataLoader />
      <SourcesPageOriginal {...props} />
    </React.Fragment>
  );

  const RouterSetup = ({ route, MockElement, SourcesPage }) => (
    <Routes>
      <Route path="/" element={SourcesPage}>
        <Route path={route.path} element={<ElementWrapper route={route}>{MockElement}</ElementWrapper>} />
      </Route>
    </Routes>
  );

  beforeEach(() => {
    initialProps = {};

    api.doLoadEntities = jest.fn().mockImplementation(() =>
      Promise.resolve({
        sources: sourcesDataGraphQl,
        meta: { count: sourcesDataGraphQl.length },
      })
    );
    api.doLoadAppTypes = jest.fn().mockImplementation(() => Promise.resolve({ data: applicationTypes }));
    typesApi.doLoadSourceTypes = jest.fn().mockImplementation(() => Promise.resolve(sourceTypes));

    store = getStore([], {
      user: { writePermissions: true },
    });

    urlQuery.updateQuery = jest.fn();
    urlQuery.parseQuery = jest.fn();
  });

  it('should fetch sources and source types on component mount', async () => {
    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store, ['/settings/sources']));

    expect(api.doLoadEntities).toHaveBeenCalled();
    expect(api.doLoadAppTypes).toHaveBeenCalled();
    expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();

    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());
    expect(screen.getByText('Cloud sources')).toBeInTheDocument();
    expect(screen.getByText('Red Hat sources')).toBeInTheDocument();
    expect(screen.getAllByText('Name')).toHaveLength(2);
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Connected applications')).toBeInTheDocument();
    expect(screen.getByText('Date added')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date added')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Items per page')).toHaveLength(2);
    expect(screen.getByText('I connected to cloud. Now what?')).toBeInTheDocument();
    expect(screen.getByText(sourcesDataGraphQl[0].name)).toBeInTheDocument();

    expect(urlQuery.parseQuery.mock.calls).toHaveLength(1);
    expect(urlQuery.updateQuery.mock.calls).toHaveLength(1);
    expect(urlQuery.updateQuery).toHaveBeenCalledWith(defaultSourcesState);
  });

  it('should use object config on small screen', async () => {
    global.mockWidth = 'sm';

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    expect(screen.getAllByLabelText('Actions')[0].closest('.pf-c-dropdown')).toHaveClass('pf-m-align-right');

    global.mockWidth = undefined;
  });

  it('do not show CloudCards on Red Hat page', async () => {
    store = getStore([], {
      sources: { activeCategory: REDHAT_VENDOR },
      user: { writePermissions: true },
    });

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    expect(() => screen.getByText('I connected to cloud. Now what?')).toThrow();
  });

  it('renders empty state when there are no Sources - CLOUD', async () => {
    store = getStore([], {
      sources: { activeCategory: CLOUD_VENDOR },
      user: { writePermissions: true },
    });

    api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    expect(screen.getByText('Get started by connecting to your public clouds')).toBeInTheDocument();

    expect(() => screen.getByText('I connected to cloud. Now what?')).toThrow();
    expect(() => screen.getByLabelText('Items per page')).toThrow();
    expect(() => screen.getByText('Connected applications')).toThrow();
    expect(() => screen.getByText('Get started by connecting to your Red Hat applications')).toThrow();
  });

  it('renders empty state when there are no Sources and open AWS selection', async () => {
    const user = userEvent.setup();

    let tmpLocation;

    tmpLocation = Object.assign({}, window.location);
    delete window.location;
    window.location = {};
    window.location.pathname = routes.sources.path;
    window.location.search = `?category=${CLOUD_VENDOR}`;

    store = getStore([], {
      sources: { activeCategory: CLOUD_VENDOR },
      user: { writePermissions: true },
    });

    api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

    render(
      componentWrapperIntl(
        <RouterSetup
          SourcesPage={<SourcesPage {...initialProps} />}
          MockElement={<AddSourceWizard.default />}
          route={routes.sourcesNew}
        />,
        store
      )
    );
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    await user.click(screen.getByText('Amazon Web Services'));

    await waitFor(() => expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`));

    expect(screen.getByText('Enter a name for your Amazon Web Services source.')).toBeInTheDocument();

    window.location = tmpLocation;
  });

  it('renders empty state when there are no Sources - RED HAT', async () => {
    store = getStore([], {
      sources: { activeCategory: REDHAT_VENDOR },
      user: { writePermissions: true },
    });

    api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    expect(screen.getByText('Get started by connecting to your Red Hat applications')).toBeInTheDocument();

    expect(() => screen.getByText('I connected to cloud. Now what?')).toThrow();
    expect(() => screen.getByLabelText('Items per page')).toThrow();
    expect(() => screen.getByText('Connected applications')).toThrow();
    expect(() => screen.getByText('Get started by connecting to your public clouds')).toThrow();
  });

  it('renders empty state when there are no Sources and open openshift selection', async () => {
    const user = userEvent.setup();

    store = getStore([], {
      sources: { activeCategory: REDHAT_VENDOR },
      user: { writePermissions: true },
    });

    api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

    render(
      componentWrapperIntl(
        <RouterSetup
          SourcesPage={<SourcesPage {...initialProps} />}
          MockElement={<AddSourceWizard.default />}
          route={routes.sourcesNew}
        />,
        store
      )
    );
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    await user.click(screen.getByText('OpenShift Container Platform'));

    await waitFor(() => expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`));

    expect(screen.getByText('Enter a name for your OpenShift Container Platform source.')).toBeInTheDocument();
  });

  it('renders error state when there is fetching (loadEntities) error', async () => {
    const ERROR_MESSAGE = 'ERROR_MESSAGE';
    api.doLoadEntities = jest.fn().mockImplementation(() => Promise.reject({ detail: ERROR_MESSAGE }));

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Something went wrong')).toBeInTheDocument());

    expect(() => screen.getByLabelText('Items per page')).toThrow();
    expect(() => screen.getByText('Connected applications')).toThrow();
  });

  it('renders error state when there is loading (sourceTypes/appTypes) error', async () => {
    const ERROR_MESSAGE = 'ERROR_MESSAGE';
    api.doLoadAppTypes = jest.fn().mockImplementation(() => Promise.reject({ detail: ERROR_MESSAGE }));

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Something went wrong')).toBeInTheDocument());

    expect(() => screen.getByLabelText('Items per page')).toThrow();
    expect(() => screen.getByText('Connected applications')).toThrow();
  });

  it('renders table and filtering - loading', async () => {
    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

    expect(screen.getAllByRole('progressbar')[0].closest('.top-pagination')).toBeInTheDocument();

    await waitFor(() => expect(screen.getAllByLabelText('Items per page')).toHaveLength(2));
  });

  it('renders table and filtering - loading with paginationClicked: true, do not show paginationLoader', async () => {
    const user = userEvent.setup();

    store = getStore([], {
      sources: { pageSize: 1 }, // enable pagination
      user: { writePermissions: true },
    });

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    api.doLoadEntities = mockApi();

    await user.click(screen.getAllByLabelText('Go to next page')[0]);

    expect(screen.getAllByRole('progressbar')[0].closest('.top-pagination')).not.toBeInTheDocument();

    api.doLoadEntities.resolve({
      sources: sourcesDataGraphQl,
      sources_aggregate: { aggregate: { total_count: sourcesDataGraphQl.length } },
    });

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());
  });

  describe('filter source type selection', () => {
    let tmpLocation;

    beforeEach(() => {
      tmpLocation = Object.assign({}, window.location);

      delete window.location;

      window.location = {};

      window.location.pathname = routes.sources.path;
    });

    afterEach(() => {
      window.location = tmpLocation;
    });

    it('shows only Red Hat sources in the selection (do not filter hidden types)', async () => {
      const user = userEvent.setup();

      window.location.search = `?category=${REDHAT_VENDOR}`;

      store = getStore([], {
        sources: {
          loaded: 1,
          numberOfEntities: 5,
          sourceTypes,
          activeCategory: REDHAT_VENDOR,
        },
        user: { writePermissions: true },
      });

      const { container } = render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.click(screen.getByText('Name', { selector: '.ins-c-conditional-filter__value-selector' }));
      await user.click(screen.getByText('Type', { selector: 'button' }));
      await user.click(screen.getByText('Filter by Type'));

      expect([...container.getElementsByClassName('pf-c-select__menu-item')].map((e) => e.textContent)).toEqual([
        'Ansible Tower',
        'OpenShift Container Platform',
        'Red Hat Satellite',
      ]);
    });

    it('shows only Cloud sources in the selection', async () => {
      const user = userEvent.setup();

      window.location.search = `?category=${CLOUD_VENDOR}`;

      store = getStore([], {
        sources: {
          loaded: 1,
          numberOfEntities: 5,
          sourceTypes,
          activeCategory: CLOUD_VENDOR,
        },
        user: { writePermissions: true },
      });

      const { container } = render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.click(screen.getByText('Name', { selector: '.ins-c-conditional-filter__value-selector' }));
      await user.click(screen.getByText('Type', { selector: 'button' }));
      await user.click(screen.getByText('Filter by Type'));

      expect([...container.getElementsByClassName('pf-c-select__menu-item')].map((e) => e.textContent)).toEqual([
        'Amazon Web Services',
        'Google Cloud',
        'IBM Cloud',
        'Microsoft Azure',
        'Oracle Cloud Infrastructure',
      ]);
    });

    it('renders correctly with type/application, loads all data', async () => {
      window.location.search = '?type=amazon';

      store = getStore([], {
        sources: {
          loaded: 1,
          numberOfEntities: 5,
          sourceTypes,
          activeCategory: CLOUD_VENDOR,
        },
        user: { writePermissions: true },
      });

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());
      expect(api.doLoadEntities).toHaveBeenCalled();
      expect(api.doLoadAppTypes).toHaveBeenCalled();
      expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();
    });
  });

  it('renders addSourceWizard', async () => {
    const user = userEvent.setup();

    render(
      componentWrapperIntl(
        <RouterSetup
          SourcesPage={<SourcesPage {...initialProps} />}
          MockElement={<AddSourceWizard.default />}
          route={routes.sourcesNew}
        />,
        store
      )
    );
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    await user.click(screen.getByText('Add source'));

    expect(screen.getAllByRole('dialog')).toBeTruthy();

    expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`);
    expect(
      screen.getByText(
        'To import data for an application, you need to connect to a data source. Start by selecting your source type.'
      )
    ).toBeInTheDocument();
  });

  it('renders and decreased page number if it is too great', async () => {
    store = getStore([], {
      sources: { pageNumber: 20 },
      user: { writePermissions: true },
    });

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    expect(screen.getByLabelText('Current page')).toHaveValue(1);
  });

  it('closes addSourceWizard', async () => {
    const user = userEvent.setup();

    render(
      componentWrapperIntl(
        <RouterSetup
          SourcesPage={<SourcesPage {...initialProps} />}
          MockElement={<AddSourceWizard.default />}
          route={routes.sourcesNew}
        />,
        store
      )
    );
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    await user.click(screen.getByText('Add source'));

    expect(screen.getAllByRole('dialog')).toBeTruthy();
    expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`);

    await user.click(screen.getByLabelText('Close wizard'));

    await waitFor(() => expect(() => screen.getByRole('dialog')).toThrow());

    expect(screen.getByTestId('location-display').textContent).toEqual(routes.sources.path);
  });

  it('afterSuccess addSourceWizard', async () => {
    const user = userEvent.setup();

    helpers.afterSuccess = jest.fn();

    const source = { id: '544615', name: 'name of created source' };

    AddSourceWizard.AddSourceWizard = ({ afterSuccess }) => <button onClick={() => afterSuccess(source)}>after success</button>;

    render(
      componentWrapperIntl(
        <RouterSetup
          SourcesPage={<SourcesPage {...initialProps} />}
          MockElement={<AddSourceWizard.AddSourceWizard />}
          route={routes.sourcesNew}
        />,
        store
      )
    );
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    expect(urlQuery.parseQuery.mock.calls).toHaveLength(1);
    expect(urlQuery.updateQuery.mock.calls).toHaveLength(1);

    await user.click(screen.getByText('Add source'));

    await waitFor(() => expect(screen.getByText('after success')).toBeInTheDocument());

    expect(urlQuery.parseQuery.mock.calls).toHaveLength(1);
    expect(urlQuery.updateQuery.mock.calls).toHaveLength(2);

    await user.click(screen.getByText('after success'));

    expect(helpers.afterSuccess).toHaveBeenCalledWith(expect.any(Function), source);
  });

  it('submitCallback addSourceWizard - available', async () => {
    const user = userEvent.setup();

    const checkSubmitSpy = jest.spyOn(helpers, 'checkSubmit');

    const source = {
      isSubmitted: true,
      sourceTypes,
      createdSource: {
        id: '544615',
        source_type_id: AMAZON_TYPE.id,
        name: 'name of created source',
        applications: [{ availability_status: AVAILABLE }],
      },
    };

    AddSourceWizard.AddSourceWizard = ({ submitCallback }) => (
      <button onClick={() => submitCallback(source)}>submit callback</button>
    );

    render(
      componentWrapperIntl(
        <React.Fragment>
          <NotificationsPortal />
          <RouterSetup
            SourcesPage={<SourcesPage {...initialProps} />}
            MockElement={<AddSourceWizard.AddSourceWizard />}
            route={routes.sourcesNew}
          />
        </React.Fragment>,
        store
      )
    );
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    await user.click(screen.getByText('Add source'));

    await waitFor(() => expect(screen.getByText('submit callback')).toBeInTheDocument());

    await user.click(screen.getByText('submit callback'));

    expect(checkSubmitSpy).toHaveBeenCalledWith(
      source,
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({ formatMessage: expect.any(Function) }),
      expect.any(Function)
    );

    expect(screen.getByText('Success alert:')).toBeInTheDocument();
    expect(screen.getByText('Amazon Web Services connection successful', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('name of created source', { selector: 'b' })).toBeInTheDocument();
    expect(screen.getByText('was successfully added', { exact: false })).toBeInTheDocument();

    await user.click(screen.getByText('View source details'));

    await waitFor(() => expect(() => screen.getByText('Success alert:')).toThrow());
    expect(screen.getByTestId('location-display').textContent).toEqual(replaceRouteId(`/${routes.sourcesDetail.path}`, '544615'));

    checkSubmitSpy.mockClear();
  });

  it('submitCallback addSourceWizard - open wizard on error', async () => {
    const user = userEvent.setup();

    const checkSubmitSpy = jest.spyOn(helpers, 'checkSubmit');

    const wizardState = {
      activeStep: 'name_step',
      activeStepIndex: '0',
      maxStepIndex: 3,
      prevSteps: [],
      registeredFieldsHistory: {},
    };

    const source = {
      isErrored: true,
      sourceTypes,
      values: { source: { name: 'some-name' } },
      wizardState,
    };

    let props;

    AddSourceWizard.AddSourceWizard = ({ submitCallback, onClose, ...rest }) => {
      props = rest;
      return (
        <div>
          <button onClick={() => submitCallback(source)}>submit callback</button>
          <button onClick={onClose}>Close wizard</button>
        </div>
      );
    };

    render(
      componentWrapperIntl(
        <React.Fragment>
          <NotificationsPortal />
          <RouterSetup
            route={routes.sourcesNew}
            MockElement={<AddSourceWizard.AddSourceWizard />}
            SourcesPage={<SourcesPage {...initialProps} />}
          />
        </React.Fragment>,
        store
      )
    );
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    await user.click(screen.getByText('Add source'));

    await waitFor(() => expect(screen.getByText('submit callback')).toBeInTheDocument());

    await user.click(screen.getByText('submit callback'));

    expect(checkSubmitSpy).toHaveBeenCalledWith(
      source,
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({ formatMessage: expect.any(Function) }),
      expect.any(Function)
    );

    await waitFor(() => expect(screen.getByText('Danger alert:')).toBeInTheDocument());

    expect(screen.getByText('Error adding source', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('There was a problem while trying to add source', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('some-name', { selector: 'b' })).toBeInTheDocument();
    expect(
      screen.getByText('Please try again. If the error persists, open a support case.', { exact: false })
    ).toBeInTheDocument();

    await user.click(screen.getByText('Retry'));

    await waitFor(() => expect(() => screen.getByText('Danger alert:')).toThrow());

    expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`);
    expect(props.initialValues).toEqual({ source: { name: 'some-name' } });
    expect(props.initialWizardState).toEqual(wizardState);

    await user.click(screen.getByText('Close wizard'));

    await waitFor(() => expect(screen.getByTestId('location-display').textContent).toEqual(routes.sources.path));

    await user.click(screen.getByText('Add source'));

    await waitFor(() => expect(screen.getByText('submit callback')).toBeInTheDocument());

    expect(props.initialValues).toEqual(undefined);
    expect(props.initialWizardState).toEqual(undefined);

    checkSubmitSpy.mockClear();
  });

  it('renders loading state when is loading', async () => {
    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

    expect(screen.getAllByRole('progressbar')).toHaveLength(3);

    const exportButton = screen.getAllByRole('button').find((e) => e.getAttribute('data-ouia-component-id') === 'Export');

    expect(exportButton).toBeDisabled();

    await waitFor(() => expect(exportButton).not.toBeDisabled());
    expect(() => screen.getAllByRole('progressbar')).toThrow();
  });

  it('should call export to csv and export to json', async () => {
    const user = userEvent.setup();

    utilsHelpers.downloadFile = jest.fn();

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

    const exportButton = screen.getAllByRole('button').find((e) => e.getAttribute('data-ouia-component-id') === 'Export');

    await user.click(exportButton);
    await user.click(screen.getByText('Export to CSV'));

    expect(utilsHelpers.downloadFile).toHaveBeenCalledWith(CSV_FILE, expect.any(String), 'csv');
    utilsHelpers.downloadFile.mockClear();

    await user.click(exportButton);
    await user.click(screen.getByText('Export to JSON'));

    expect(utilsHelpers.downloadFile).toHaveBeenCalledWith(JSON_FILE_STRING, expect.any(String), 'json');
  });

  describe('filtering', () => {
    const SEARCH_TERM = 'Pepa';

    it('should call onFilterSelect', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);

      await waitFor(() =>
        expect(store.getState().sources.filterValue).toEqual({
          name: SEARCH_TERM,
        })
      );
    });

    it('should call onFilterSelect with type', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toBeInTheDocument());

      await user.click(screen.getByText('Name', { selector: '.ins-c-conditional-filter__value-selector' }));
      await user.click(screen.getByText('Type', { selector: 'button' }));
      await user.click(screen.getByText('Filter by Type'));
      await user.click(screen.getByText('Amazon Web Services', { selector: '.pf-c-check__label' }));

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toBeInTheDocument());
      expect(screen.getByText('Amazon Web Services', { selector: '.pf-c-chip__text' })).toBeInTheDocument();

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        source_type_id: [AMAZON_TYPE.id],
      });
    });

    it('should call onFilterSelect with applications', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      await user.click(screen.getByText('Name', { selector: '.ins-c-conditional-filter__value-selector' }));
      await user.click(screen.getByText('Application', { selector: 'button' }));
      await user.click(screen.getByText('Filter by Application'));
      await user.click(screen.getByText('Cost Management', { selector: '.pf-c-check__label' }));

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toBeInTheDocument());
      expect(screen.getByText('Cost Management', { selector: '.pf-c-chip__text' })).toBeInTheDocument();

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        applications: [COST_MANAGEMENT_APP.id],
      });
    });

    it('should call onFilterSelect with available status', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      await user.click(screen.getByText('Name', { selector: '.ins-c-conditional-filter__value-selector' }));
      await user.click(screen.getByText('Status', { selector: 'button' }));
      await user.click(screen.getByText('Filter by Status'));
      await user.click(screen.getByText('Available', { selector: '.pf-c-check__label' }));

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toBeInTheDocument());
      expect(screen.getByText('Available', { selector: '.pf-c-chip__text' })).toBeInTheDocument();

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        availability_status: [AVAILABLE],
      });

      await user.click(screen.getByText('Unavailable', { selector: '.pf-c-check__label' }));

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toBeInTheDocument());
      expect(screen.getByText('Unavailable', { selector: '.pf-c-chip__text' })).toBeInTheDocument();

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        availability_status: [UNAVAILABLE],
      });

      await user.click(screen.getByText('Unavailable', { selector: '.pf-c-check__label' }));

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toBeInTheDocument());

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        availability_status: [],
      });
    });

    it('filtered value is shown in the input', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);

      await waitFor(() => expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue(SEARCH_TERM));
    });

    it('should remove the name badge when clicking on remove icon in chip', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);

      await waitFor(() => expect(screen.getByLabelText('close')).toBeInTheDocument());

      await user.click(screen.getByLabelText('close'));

      await waitFor(() => expect(() => screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toThrow());
      expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue('');
    });

    it('should not remove the name badge when clicking on chip', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toBeInTheDocument());

      await user.click(screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' }));

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toBeInTheDocument());

      expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue(SEARCH_TERM);
    });

    it('should remove the name badge when clicking on Clear filters button', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);

      await waitFor(() => expect(screen.getByText('Clear filters')).toBeInTheDocument());

      await user.click(screen.getByText('Clear filters'));

      await waitFor(() => expect(() => screen.getByText(SEARCH_TERM, { selector: '.pf-c-chip__text' })).toThrow());

      expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue('');
      expect(() => screen.getByText('Clear filters')).toThrow();
    });

    it('renders emptyStateTable when no entities found', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);

      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      const totalNonsense = '122#$@#%#^$#@!^$#^$#^546454abcerd';

      await user.clear(screen.getByPlaceholderText('Filter by Name'));
      await user.type(screen.getByPlaceholderText('Filter by Name'), `${totalNonsense}`);

      await waitFor(() =>
        expect(store.getState().sources.filterValue).toEqual({
          name: totalNonsense,
        })
      );
      expect(store.getState().sources.numberOfEntities).toEqual(0);

      expect(screen.getByText('No sources found')).toBeInTheDocument();
      expect(
        screen.getByText('No sources match the filter criteria. Remove all filters or clear all filters to show sources.')
      ).toBeInTheDocument();
      expect(screen.getByText('Clear all filters')).toBeInTheDocument();
      expect(() => screen.getAllByLabelText('Items per page')).toThrow();
    });

    it('show empty state table after clicking on clears all filter in empty table state - RED HAT', async () => {
      const user = userEvent.setup();

      store = getStore([], {
        sources: { activeCategory: REDHAT_VENDOR },
        user: { writePermissions: true },
      });

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await user.clear(screen.getByPlaceholderText('Filter by Name'));
      await user.type(screen.getByPlaceholderText('Filter by Name'), `${SEARCH_TERM}`);

      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      const totalNonsense = '122#$@#%#^$#@!^$#^$#^546454abcerd';

      await user.clear(screen.getByPlaceholderText('Filter by Name'));
      await user.type(screen.getByPlaceholderText('Filter by Name'), `${totalNonsense}`);

      await waitFor(() => expect(screen.getByText('Clear filters')).toBeInTheDocument());

      await user.click(screen.getByText('Clear all filters'));

      await waitFor(() => expect(screen.getByText('Get started by connecting to your Red Hat applications')).toBeInTheDocument());
    });

    it('clears filter value in the name input when clicking on clears all filter in empty table state and show table', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);

      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      const totalNonsense = '122#$@#%#^$#@!^$#^$#^546454abcerd';

      await user.clear(screen.getByPlaceholderText('Filter by Name'));
      await user.type(screen.getByPlaceholderText('Filter by Name'), `${totalNonsense}`);

      await waitFor(() => expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue(totalNonsense));

      await waitFor(() => expect(screen.getByText('Clear all filters')).toBeInTheDocument());

      api.doLoadEntities.mockImplementation(() =>
        Promise.resolve({
          sources: sourcesDataGraphQl,
          meta: { count: sourcesDataGraphQl.length },
        })
      );

      await user.click(screen.getByText('Clear all filters'));

      await waitFor(() => expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue(''));
    });
  });

  describe('not write permissions', () => {
    beforeEach(() => {
      store = getStore([], {
        sources: {},
        user: { writePermissions: false },
      });
    });

    it('show different text when org admin', async () => {
      const user = userEvent.setup({ pointerEventsCheck: false });

      store = getStore([], {
        sources: {},
        user: { writePermissions: false, isOrgAdmin: true },
      });

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      expect(api.doLoadEntities).toHaveBeenCalled();
      expect(api.doLoadAppTypes).toHaveBeenCalled();
      expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();

      expect(screen.getByText('Add source')).toBeDisabled();

      await act(async () => {
        await user.click(screen.getByText('Add source'));
      });

      await user.click(screen.getByText('Add source').closest('.mocked-tooltip'));

      await waitFor(() =>
        expect(
          screen.getByText('To add a source, you must add Sources Administrator permissions to your user.')
        ).toBeInTheDocument()
      );

      expect(screen.getByTestId('location-display').textContent).toEqual('/');
    });

    it('should fetch sources and source types on component mount', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      expect(api.doLoadEntities).toHaveBeenCalled();
      expect(api.doLoadAppTypes).toHaveBeenCalled();
      expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();

      expect(screen.getByText('Add source')).toBeDisabled();

      await act(async () => {
        await user.click(screen.getByText('Add source'));
      });

      await user.click(screen.getByText('Add source').closest('.mocked-tooltip'));

      await waitFor(() =>
        expect(
          screen.getByText('To add a source, your Organization Administrator must grant you Sources Administrator permissions.')
        ).toBeInTheDocument()
      );

      expect(screen.getByTestId('location-display').textContent).toEqual('/');
    });

    it('should use object config on small screen', async () => {
      const user = userEvent.setup();

      global.mockWidth = 'sm';

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      await waitFor(() => expect(screen.getByText('Add source')).toBeInTheDocument());

      expect(screen.getAllByLabelText('Actions')[0].closest('.pf-c-dropdown')).toHaveClass('pf-m-align-right');

      await user.click(screen.getAllByLabelText('Actions')[0]);

      await act(async () => {
        await user.click(screen.getByText('Add source', { selector: '.pf-c-dropdown__menu-item' }));
      });

      await user.click(screen.getByText('Add source', { selector: '.pf-c-dropdown__menu-item' }).closest('.mocked-tooltip'));

      await waitFor(() =>
        expect(
          screen.getByText('To add a source, your Organization Administrator must grant you Sources Administrator permissions.')
        ).toBeInTheDocument()
      );

      expect(screen.getByTestId('location-display').textContent).toEqual('/');
    });
  });

  describe('routes', () => {
    let initialEntry;

    const wasRedirectedToRoot = () => screen.getByTestId('location-display').textContent === routes.sources.path;
    let consoleSpy;
    beforeAll(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    it('renders remove', async () => {
      SourceRemoveModal.default = () => <h1>remove modal mock</h1>;
      initialEntry = [replaceRouteId('/' + routes.sourcesRemove.path, SOURCE_ALL_APS_ID)];

      await act(async () => {
        render(
          componentWrapperIntl(
            <RouterSetup
              route={routes.sourcesRemove}
              MockElement={<SourceRemoveModal.default />}
              SourcesPage={<SourcesPage {...initialProps} />}
            />,
            store,
            initialEntry
          )
        );
      });

      expect(wasRedirectedToRoot()).toEqual(false);
      expect(screen.getByText('remove modal mock')).toBeInTheDocument();
    });

    describe('id not found, redirect back to sources', () => {
      const NONSENSE_ID = '&88{}#558';

      beforeEach(() => {
        api.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
      });

      it('when remove', async () => {
        SourceRemoveModal.default = () => <h1>remove modal mock</h1>;
        initialEntry = [replaceRouteId('/' + routes.sourcesRemove.path, NONSENSE_ID)];

        await act(async () => {
          render(
            componentWrapperIntl(
              <RouterSetup
                route={routes.sourcesRemove}
                MockElement={<SourceRemoveModal.default />}
                SourcesPage={<SourcesPage {...initialProps} />}
              />,
              store,
              initialEntry
            )
          );
        });

        expect(() => screen.getByText('remove modal mock')).toThrow();
        expect(wasRedirectedToRoot()).toEqual(true);
      });
    });

    describe('not org admin, redirect back to sources', () => {
      beforeEach(() => {
        store = getStore([], {
          user: { writePermissions: false },
        });
      });

      it('when remove', async () => {
        SourceRemoveModal.default = () => <h1>remove modal mock</h1>;
        initialEntry = [replaceRouteId(routes.sourcesRemove.path, SOURCE_ALL_APS_ID)];

        await act(async () => {
          render(
            componentWrapperIntl(
              <RouterSetup
                route={routes.sourcesRemove}
                MockElement={<SourceRemoveModal.default />}
                SourcesPage={<SourcesPage {...initialProps} />}
              />,
              store,
              initialEntry
            )
          );
        });

        expect(() => screen.getByText('remove modal mock')).toThrow();
        expect(wasRedirectedToRoot()).toEqual(true);
      });
    });
  });
});
