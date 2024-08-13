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
import * as hcsApi from '../../api/checkAccountHCS';
import * as typesApi from '../../api/source_types';
import { replaceRouteId, routes } from '../../Routing';
import * as helpers from '../../pages/Sources/helpers';
import * as dependency from '../../api/wizardHelpers';
import * as SourceRemoveModal from '../../components/SourceRemoveModal/SourceRemoveModal';
import * as urlQuery from '../../utilities/urlQuery';

import DataLoader from '../../components/DataLoader';
import ElementWrapper from '../../components/ElementWrapper/ElementWrapper';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../utilities/constants';
import { getStore } from '../../utilities/store';
import { AVAILABLE, UNAVAILABLE } from '../../views/formatters';
import * as AddSourceWizard from '../../components/addSourceWizard';
import { CSV_FILE, JSON_FILE_STRING } from '../__mocks__/fileMocks';
import hcsEnrollment from '../__mocks__/hcs';

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
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    getEnvironment: () => 'bar',
    isBeta: () => false,
    auth: { getToken: () => Promise.resolve() },
    isProd: () => false,
  });
});

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
    global.mockWidth = undefined;
    initialProps = {};

    api.doLoadEntities = jest.fn().mockImplementation(() =>
      Promise.resolve({
        sources: sourcesDataGraphQl,
        meta: { count: sourcesDataGraphQl.length },
      }),
    );
    api.doLoadAppTypes = jest.fn().mockImplementation(() => Promise.resolve({ data: applicationTypes }));
    typesApi.doLoadSourceTypes = jest.fn().mockImplementation(() => Promise.resolve(sourceTypes));
    hcsApi.checkAccountHCS = jest.fn().mockImplementation(() => Promise.resolve({ hcsDeal: false, hcsDataVisibility: false }));

    store = getStore([], {
      user: { writePermissions: true },
      sources: { activeCategory: CLOUD_VENDOR },
    });

    urlQuery.updateQuery = jest.fn();
    urlQuery.parseQuery = jest.fn();
  });

  it('should fetch sources and source types on component mount', async () => {
    let container;
    await act(async () => {
      const { container: internalContainer } = await render(
        componentWrapperIntl(<SourcesPage {...initialProps} />, store, ['/settings/integrations']),
      );
      container = internalContainer;
    });

    expect(api.doLoadEntities).toHaveBeenCalled();
    expect(api.doLoadAppTypes).toHaveBeenCalled();
    expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();
    expect(hcsApi.checkAccountHCS).toHaveBeenCalled();

    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());
    expect(screen.getByText('Cloud sources')).toBeInTheDocument();
    expect(screen.getByText('Red Hat sources')).toBeInTheDocument();
    expect(screen.getAllByText('Name')).toHaveLength(2);
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Connected applications')).toBeInTheDocument();
    expect(screen.getByText('Date added')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date added')).toBeInTheDocument();
    expect(container.querySelectorAll('.pf-v5-c-pagination')).toHaveLength(2);
    expect(screen.getByText('I connected to cloud. Now what?')).toBeInTheDocument();
    expect(screen.getByText(sourcesDataGraphQl[0].name)).toBeInTheDocument();

    expect(urlQuery.parseQuery.mock.calls).toHaveLength(1);
    expect(urlQuery.updateQuery.mock.calls).toHaveLength(1);
    expect(urlQuery.updateQuery).toHaveBeenCalledWith({ ...defaultSourcesState, activeCategory: 'Cloud' });
  });

  it('should use object config on small screen', async () => {
    global.mockWidth = 'sm';

    await act(async () => {
      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    });
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    expect(screen.getAllByLabelText('Kebab toggle')[0]).toHaveClass('pf-m-plain');

    global.mockWidth = undefined;
  });

  it('do not show CloudCards on Red Hat page', async () => {
    store = getStore([], {
      sources: { activeCategory: REDHAT_VENDOR },
      user: { writePermissions: true },
    });

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    expect(() => screen.getByText('I connected to cloud. Now what?')).toThrow();
  });

  it('renders empty state when there are no Sources - CLOUD', async () => {
    store = getStore([], {
      sources: { activeCategory: CLOUD_VENDOR },
      user: { writePermissions: true },
    });

    api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    expect(screen.getByText('Get started by connecting to your public clouds')).toBeInTheDocument();

    expect(() => screen.getByText('I connected to cloud. Now what?')).toThrow();
    expect(() => screen.getByLabelText('Items per page')).toThrow();
    expect(() => screen.getByText('Connected applications')).toThrow();
    expect(() => screen.getByText('Get started by connecting to your Red Hat applications')).toThrow();
  });

  it('renders empty state when there are no Sources and open AWS selection', async () => {
    const user = userEvent.setup();
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));

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

    await act(async () => {
      await render(
        componentWrapperIntl(
          <RouterSetup
            SourcesPage={<SourcesPage {...initialProps} />}
            MockElement={<AddSourceWizard.default onClose={jest.fn()} isOpen={false} />}
            route={routes.sourcesNew}
          />,
          store,
        ),
      );
    });

    await act(async () => {
      await user.click(screen.getByText('Amazon Web Services'));
    });

    await waitFor(() => expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`));

    expect(screen.getByText('Enter a name for your Amazon Web Services integration.')).toBeInTheDocument();

    window.location = tmpLocation;
  });

  it('renders empty state when there are no Sources - RED HAT', async () => {
    store = getStore([], {
      sources: { activeCategory: REDHAT_VENDOR },
      user: { writePermissions: true },
    });

    api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    expect(screen.getByText('Get started by connecting to your Red Hat applications')).toBeInTheDocument();

    expect(() => screen.getByText('I connected to cloud. Now what?')).toThrow();
    expect(() => screen.getByLabelText('Items per page')).toThrow();
    expect(() => screen.getByText('Connected applications')).toThrow();
    expect(() => screen.getByText('Get started by connecting to your public clouds')).toThrow();
  });

  it('renders empty state when there are no Sources and open openshift selection', async () => {
    const user = userEvent.setup();
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));

    store = getStore([], {
      sources: { activeCategory: REDHAT_VENDOR },
      user: { writePermissions: true },
    });

    api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

    render(
      componentWrapperIntl(
        <RouterSetup
          SourcesPage={<SourcesPage {...initialProps} />}
          MockElement={<AddSourceWizard.default onClose={jest.fn()} isOpen={false} />}
          route={routes.sourcesNew}
        />,
        store,
      ),
    );
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    await act(async () => {
      await user.click(screen.getByText('OpenShift Container Platform'));
    });

    await waitFor(() => expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`));

    expect(screen.getByText('Enter a name for your OpenShift Container Platform integration.')).toBeInTheDocument();
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
    const { container } = render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

    await act(async () => {
      expect(screen.getAllByRole('progressbar')[0].closest('.top-pagination')).toBeInTheDocument();
    });

    await waitFor(() => expect(container.querySelectorAll('.pf-v5-c-pagination')).toHaveLength(2));
  });

  it('renders table and filtering - loading with paginationClicked: true, do not show paginationLoader', async () => {
    const user = userEvent.setup();

    store = getStore([], {
      sources: { pageSize: 1, activeCategory: CLOUD_VENDOR }, // enable pagination
      user: { writePermissions: true },
    });

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    api.doLoadEntities = mockApi();

    await waitFor(async () => {
      await user.click(screen.getAllByLabelText('Go to next page')[0]);
    });

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

      let container;
      await act(async () => {
        const { container: ci } = render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
        container = ci;
      });
      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.click(screen.getByText('Name', { selector: '.ins-c-conditional-filter__value-selector' }));
      });
      await act(async () => {
        await user.click(screen.getByText('Type', { selector: '.pf-v5-c-menu__item-text' }));
      });
      await act(async () => {
        await user.click(screen.getByText('Filter by Type'));
      });

      expect([...container.getElementsByClassName('pf-v5-c-menu__item-text')].map((e) => e.textContent)).toEqual([
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

      let container;
      await act(async () => {
        const { container: ci } = render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
        container = ci;
      });
      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.click(screen.getByText('Name', { selector: '.ins-c-conditional-filter__value-selector' }));
      });

      await act(async () => {
        await user.click(screen.getByText('Type', { selector: '.pf-v5-c-menu__item-text' }));
      });
      await act(async () => {
        await user.click(screen.getByText('Filter by Type'));
      });

      expect([...container.getElementsByClassName('pf-v5-c-menu__item-text')].map((e) => e.textContent)).toEqual([
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
      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());
      expect(api.doLoadEntities).toHaveBeenCalled();
      expect(api.doLoadAppTypes).toHaveBeenCalled();
      expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();
    });
  });

  it('renders addSourceWizard', async () => {
    const user = userEvent.setup();
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));

    await act(async () => {
      render(
        componentWrapperIntl(
          <RouterSetup
            SourcesPage={<SourcesPage {...initialProps} />}
            MockElement={<AddSourceWizard.default isOpen={false} onClose={jest.fn()} />}
            route={routes.sourcesNew}
          />,
          store,
        ),
      );
    });
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    await act(async () => {
      await user.click(screen.getByText('Add integration'));
    });

    expect(screen.getAllByRole('dialog')).toBeTruthy();

    expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`);
    expect(
      screen.getByText(
        'To import data for an application, you need to connect to a data source. Start by selecting your cloud provider.',
      ),
    ).toBeInTheDocument();
  });

  it('renders and decreased page number if it is too great', async () => {
    store = getStore([], {
      sources: { pageNumber: 20, activeCategory: CLOUD_VENDOR },
      user: { writePermissions: true },
    });

    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    expect(screen.getByLabelText('Current page')).toHaveValue(1);
  });

  it('closes addSourceWizard', async () => {
    const user = userEvent.setup();
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));

    await act(async () => {
      render(
        componentWrapperIntl(
          <RouterSetup
            SourcesPage={<SourcesPage {...initialProps} />}
            MockElement={<AddSourceWizard.default onClose={jest.fn()} isOpen={false} />}
            route={routes.sourcesNew}
          />,
          store,
        ),
      );
    });
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    await act(async () => {
      await user.click(screen.getByText('Add integration'));
    });

    expect(screen.getAllByRole('dialog')).toBeTruthy();
    expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`);

    await act(async () => {
      await user.click(screen.getByLabelText('Close wizard'));
    });

    await waitFor(() => expect(() => screen.getByRole('dialog')).toThrow());

    expect(screen.getByTestId('location-display').textContent).toEqual(routes.sources.path);
  });

  it('afterSuccess addSourceWizard', async () => {
    const user = userEvent.setup();

    helpers.afterSuccess = jest.fn();

    const source = { id: '544615', name: 'name of created source' };

    AddSourceWizard.AddSourceWizard = ({ afterSuccess }) => <button onClick={() => afterSuccess(source)}>after success</button>;

    await act(async () => {
      render(
        componentWrapperIntl(
          <RouterSetup
            SourcesPage={<SourcesPage {...initialProps} />}
            MockElement={<AddSourceWizard.AddSourceWizard />}
            route={routes.sourcesNew}
          />,
          store,
        ),
      );
    });
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    expect(urlQuery.parseQuery.mock.calls).toHaveLength(1);
    expect(urlQuery.updateQuery.mock.calls).toHaveLength(1);

    await act(async () => {
      await user.click(screen.getByText('Add integration'));
    });

    await waitFor(() => expect(screen.getByText('after success')).toBeInTheDocument());

    expect(urlQuery.parseQuery.mock.calls).toHaveLength(1);
    expect(urlQuery.updateQuery.mock.calls).toHaveLength(2);

    await waitFor(async () => {
      await user.click(screen.getByText('after success'));
    });

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

    await act(async () => {
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
          store,
        ),
      );
    });
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    await act(async () => {
      await user.click(screen.getByText('Add integration'));
    });

    await waitFor(() => expect(screen.getByText('submit callback')).toBeInTheDocument());

    await act(async () => {
      await user.click(screen.getByText('submit callback'));
    });

    expect(checkSubmitSpy).toHaveBeenCalledWith(
      source,
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({ formatMessage: expect.any(Function) }),
      expect.any(Function),
    );

    expect(screen.getByText('Success alert:')).toBeInTheDocument();
    expect(screen.getByText('Amazon Web Services connection successful', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('name of created source', { selector: 'b' })).toBeInTheDocument();
    expect(screen.getByText('was successfully added', { exact: false })).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByText('View source details'));
    });

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

    await act(async () => {
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
          store,
        ),
      );
    });
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    await act(async () => {
      await user.click(screen.getByText('Add integration'));
    });

    await waitFor(() => expect(screen.getByText('submit callback')).toBeInTheDocument());

    await act(async () => {
      await user.click(screen.getByText('submit callback'));
    });

    expect(checkSubmitSpy).toHaveBeenCalledWith(
      source,
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({ formatMessage: expect.any(Function) }),
      expect.any(Function),
    );

    await waitFor(() => expect(screen.getByText('Danger alert:')).toBeInTheDocument());

    expect(screen.getByText('Error adding integration', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('There was a problem while trying to add integration', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('some-name', { selector: 'b' })).toBeInTheDocument();
    expect(
      screen.getByText('Please try again. If the error persists, open a support case.', { exact: false }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByText('Retry'));
    });

    await waitFor(() => expect(() => screen.getByText('Danger alert:')).toThrow());

    expect(screen.getByTestId('location-display').textContent).toEqual(`/${routes.sourcesNew.path}`);
    expect(props.initialValues).toEqual({ source: { name: 'some-name' } });
    expect(props.initialWizardState).toEqual(wizardState);

    await act(async () => {
      await user.click(screen.getByText('Close wizard'));
    });

    await waitFor(() => expect(screen.getByTestId('location-display').textContent).toEqual(routes.sources.path));

    await act(async () => {
      await user.click(screen.getByText('Add integration'));
    });

    await waitFor(() => expect(screen.getByText('submit callback')).toBeInTheDocument());

    expect(props.initialValues).toEqual(undefined);
    expect(props.initialWizardState).toEqual(undefined);

    checkSubmitSpy.mockClear();
  });

  it('renders loading state when is loading', async () => {
    render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

    expect(screen.getAllByRole('progressbar')).toHaveLength(3);

    act(() => {
      screen.getByLabelText('Export').click();
    });
    const csvButton = screen.getByText('Export to CSV').closest('button');

    // wrap in wait to let the state transitions after the assertion.
    await act(async () => {
      expect(csvButton).toBeDisabled();
    });
    await waitFor(() => expect(csvButton).not.toBeDisabled());
    expect(() => screen.getAllByRole('progressbar')).toThrow();
  });

  it('should call export to csv and export to json', async () => {
    const user = userEvent.setup();

    utilsHelpers.downloadFile = jest.fn();

    await act(async () => {
      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
    });
    await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

    const exportButton = screen.getByLabelText('Export');

    await act(async () => {
      await user.click(exportButton);
    });
    await act(async () => {
      await user.click(screen.getByText('Export to CSV'));
    });

    expect(utilsHelpers.downloadFile).toHaveBeenCalledWith(CSV_FILE, expect.any(String), 'csv');
    utilsHelpers.downloadFile.mockClear();

    await act(async () => {
      await user.click(exportButton);
    });
    await act(async () => {
      await user.click(screen.getByText('Export to JSON'));
    });

    expect(utilsHelpers.downloadFile).toHaveBeenCalledWith(JSON_FILE_STRING, expect.any(String), 'json');
  });

  describe('filtering', () => {
    const SEARCH_TERM = 'Pepa';

    it('should call onFilterSelect', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });

      await waitFor(() =>
        expect(store.getState().sources.filterValue).toEqual({
          name: SEARCH_TERM,
        }),
      );
    });

    it('should call onFilterSelect with type', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument());

      await act(async () => {
        await user.click(screen.getByText('Name', { selector: '.ins-c-conditional-filter__value-selector' }));
      });
      await act(async () => {
        await user.click(screen.getByText('Type', { selector: '.pf-v5-c-menu__item-text' }));
      });
      await act(async () => {
        await user.click(screen.getByText('Filter by Type'));
      });

      await act(async () => {
        await user.click(screen.getByText('Amazon Web Services', { selector: '.pf-v5-c-menu__item-text' }));
      });

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument());
      expect(screen.getByText('Amazon Web Services', { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument();

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        source_type_id: [AMAZON_TYPE.id],
      });
    });

    it('should call onFilterSelect with applications', async () => {
      const user = userEvent.setup();

      console.log(store, 'this is store!');

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });
      await act(async () => {
        await user.click(screen.getByText('Name', { selector: '.ins-c-conditional-filter__value-selector' }));
      });
      await act(async () => {
        await user.click(screen.getByText('Application', { selector: '.pf-v5-c-menu__item-text' }));
      });
      await act(async () => {
        await user.click(screen.getByText('Filter by Application'));
      });
      await waitFor(async () => {
        await user.click(screen.getByText('Cost Management', { selector: '.pf-v5-c-menu__item-text' }));
      });

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument());
      expect(screen.getByText('Cost Management', { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument();

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        applications: [COST_MANAGEMENT_APP.id],
      });
    });

    it('should call onFilterSelect with available status', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });
      await act(async () => {
        await user.click(screen.getAllByText('Name')[0].closest('button'));
      });

      await act(async () => {
        await user.click(screen.getByText('Status', { selector: '.pf-v5-c-menu__item-text' }));
      });
      await act(async () => {
        await user.click(screen.getByText('Filter by Status'));
      });
      await act(async () => {
        await user.click(screen.getByText('Available', { selector: '.pf-v5-c-menu__item-text' }));
      });

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument());
      expect(screen.getByText('Available', { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument();

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        availability_status: [AVAILABLE],
      });

      await act(async () => {
        await user.click(screen.getByText('Unavailable', { selector: '.pf-v5-c-menu__item-text' }));
      });

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument());
      expect(screen.getByText('Unavailable', { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument();

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        availability_status: [UNAVAILABLE],
      });

      await act(async () => {
        await user.click(screen.getByText('Unavailable', { selector: '.pf-v5-c-menu__item-text' }));
      });

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument());

      expect(store.getState().sources.filterValue).toEqual({
        name: SEARCH_TERM,
        availability_status: [],
      });
    });

    it('filtered value is shown in the input', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });

      await waitFor(() => expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue(SEARCH_TERM));
    });

    it('should remove the name badge when clicking on remove icon in chip', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });

      await waitFor(() => expect(screen.getByLabelText('close')).toBeInTheDocument());

      await act(async () => {
        await screen.getByLabelText('close').click();
        await screen.getByLabelText('close').click();
      });

      expect(() => screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toThrow();
      expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue('');
    });

    it('should not remove the name badge when clicking on chip', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument());

      await act(async () => {
        await user.click(screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' }));
      });

      await waitFor(() => expect(screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toBeInTheDocument());

      expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue(SEARCH_TERM);
    });

    it('should remove the name badge when clicking on Clear filters button', async () => {
      const user = userEvent.setup();

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });

      await waitFor(() => expect(screen.getByText('Clear filters')).toBeInTheDocument());

      await act(async () => {
        await user.click(screen.getByText('Clear filters'));
      });

      await waitFor(() => expect(() => screen.getByText(SEARCH_TERM, { selector: '.pf-v5-c-chip__text' })).toThrow());

      expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue('');
      expect(() => screen.getByText('Clear filters')).toThrow();
    });

    it('renders emptyStateTable when no entities found', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });

      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      const totalNonsense = '122#$@#%#^$#@!^$#^$#^546454abcerd';

      await act(async () => {
        await user.clear(screen.getByPlaceholderText('Filter by Name'));
        await user.type(screen.getByPlaceholderText('Filter by Name'), `${totalNonsense}`);
      });

      await waitFor(() =>
        expect(store.getState().sources.filterValue).toEqual({
          name: totalNonsense,
        }),
      );
      expect(store.getState().sources.numberOfEntities).toEqual(0);

      expect(screen.getByText('No sources found')).toBeInTheDocument();
      expect(
        screen.getByText('No sources match the filter criteria. Remove all filters or clear all filters to show sources.'),
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

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await act(async () => {
        await user.clear(screen.getByPlaceholderText('Filter by Name'));
        await user.type(screen.getByPlaceholderText('Filter by Name'), `${SEARCH_TERM}`);
      });

      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      const totalNonsense = '122#$@#%#^$#@!^$#^$#^546454abcerd';

      await act(async () => {
        await user.clear(screen.getByPlaceholderText('Filter by Name'));
        await user.type(screen.getByPlaceholderText('Filter by Name'), `${totalNonsense}`);
      });

      await waitFor(() => expect(screen.getByText('Clear filters')).toBeInTheDocument());

      await act(async () => {
        await user.click(screen.getByText('Clear all filters'));
      });

      await waitFor(() => expect(screen.getByText('Get started by connecting to your Red Hat applications')).toBeInTheDocument());
    });

    it('clears filter value in the name input when clicking on clears all filter in empty table state and show table', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });

      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      await act(async () => {
        await user.type(screen.getByPlaceholderText('Filter by Name'), SEARCH_TERM);
      });

      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));

      const totalNonsense = '122#$@#%#^$#@!^$#^$#^546454abcerd';

      await act(async () => {
        await user.clear(screen.getByPlaceholderText('Filter by Name'));
        await user.type(screen.getByPlaceholderText('Filter by Name'), `${totalNonsense}`);
      });

      await waitFor(() => expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue(totalNonsense));

      await waitFor(() => expect(screen.getByText('Clear all filters')).toBeInTheDocument());

      api.doLoadEntities.mockImplementation(() =>
        Promise.resolve({
          sources: sourcesDataGraphQl,
          meta: { count: sourcesDataGraphQl.length },
        }),
      );

      await act(async () => {
        await user.click(screen.getByText('Clear all filters'));
      });

      await waitFor(() => expect(screen.getByPlaceholderText('Filter by Name')).toHaveValue(''));
    });
  });

  describe('not write permissions', () => {
    beforeEach(() => {
      store = getStore([], {
        sources: { activeCategory: CLOUD_VENDOR },
        user: { writePermissions: false },
      });
    });

    it('show different text when org admin', async () => {
      const user = userEvent.setup({ pointerEventsCheck: false });

      store = getStore([], {
        sources: { activeCategory: CLOUD_VENDOR },
        user: { writePermissions: false, isOrgAdmin: true },
      });

      render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      expect(api.doLoadEntities).toHaveBeenCalled();
      expect(api.doLoadAppTypes).toHaveBeenCalled();
      expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();

      expect(screen.getByText('Add integration')).toBeDisabled();

      await act(async () => {
        await user.click(screen.getByText('Add integration'));
      });

      await waitFor(async () => {
        await user.click(screen.getByText('Add integration').closest('.mocked-tooltip'));
      });

      await waitFor(() =>
        expect(
          screen.getByText('To add a source, you must add Cloud Administrator permissions to your user.'),
        ).toBeInTheDocument(),
      );

      expect(screen.getByTestId('location-display').textContent).toEqual('/');
    });

    it('should fetch sources and source types on component mount', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });
      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      expect(api.doLoadEntities).toHaveBeenCalled();
      expect(api.doLoadAppTypes).toHaveBeenCalled();
      expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();

      expect(screen.getByText('Add integration')).toBeDisabled();

      await act(async () => {
        await user.click(screen.getByText('Add integration'));
      });

      await waitFor(async () => {
        await user.click(screen.getByText('Add integration').closest('.mocked-tooltip'));
      });

      await waitFor(() =>
        expect(
          screen.getByText('To add a source, your Organization Administrator must grant you Cloud Administrator permissions.'),
        ).toBeInTheDocument(),
      );

      expect(screen.getByTestId('location-display').textContent).toEqual('/');
    });

    // FIXME: UI works, just cant find the correct elements in test env
    it.skip('should use object config on small screen', async () => {
      const user = userEvent.setup();

      global.mockWidth = 'sm';

      await act(async () => {
        render(componentWrapperIntl(<SourcesPage {...initialProps} />, store));
      });
      await waitFor(() => expect(screen.getByText('Add integration')).toBeInTheDocument());

      expect(screen.getAllByLabelText('kebab dropdown toggle')[0]).toHaveClass('pf-m-plain');

      await act(async () => {
        await user.click(screen.getAllByLabelText('kebab dropdown toggle')[0]);
      });

      await act(async () => {
        await user.click(screen.getAllByText('Add integration')[0].closest('.src-m-dropdown-item-disabled'));
      });

      await act(async () => {
        await user.click(screen.getAllByText('Add integration')[0].closest('.src-m-dropdown-item-disabled'));
      });

      await waitFor(() =>
        expect(
          screen.getByText('To add a source, your Organization Administrator must grant you Cloud Administrator permissions.'),
        ).toBeInTheDocument(),
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
            initialEntry,
          ),
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
              initialEntry,
            ),
          );
        });

        expect(() => screen.getByText('remove modal mock')).toThrow();
        expect(wasRedirectedToRoot()).toEqual(true);
      });
    });

    describe('not org admin, redirect back to sources', () => {
      beforeEach(() => {
        store = getStore([], {
          user: { writePermissions: false, activeCategory: CLOUD_VENDOR },
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
              initialEntry,
            ),
          );
        });

        expect(() => screen.getByText('remove modal mock')).toThrow();
        expect(wasRedirectedToRoot()).toEqual(true);
      });
    });
  });
});
