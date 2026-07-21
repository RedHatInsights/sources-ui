import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import PermissionsChecker from '../../components/PermissionsChecker';
import * as actions from '../../redux/user/actions';
import * as kesselActions from '../../redux/user/kesselActions';
import { KesselRbacAccessContext } from '../../rbac/KesselRbacAccessContext';

// Mock Chrome
const mockGetUserPermissions = jest.fn();
const mockGetUser = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      getUser: mockGetUser,
    },
    getUserPermissions: mockGetUserPermissions,
  }),
}));

// Mock actions
jest.mock('../../redux/user/actions', () => ({
  loadWritePermissions: jest.fn(() => ({ type: 'LOAD_WRITE_PERMISSIONS' })),
  loadOrgAdmin: jest.fn(() => ({ type: 'LOAD_ORG_ADMIN' })),
  loadIntegrationsEndpointsPermissions: jest.fn(() => ({ type: 'LOAD_INTEGRATIONS_ENDPOINTS' })),
  loadIntegrationsReadPermissions: jest.fn(() => ({ type: 'LOAD_INTEGRATIONS_READ' })),
}));

jest.mock('../../redux/user/kesselActions', () => ({
  loadPermissionsFromKessel: jest.fn(() => ({ type: 'LOAD_KESSEL_PERMISSIONS' })),
}));

describe('PermissionsChecker', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  const Children = () => <h1>App</h1>;

  const renderWithProviders = (
    { kesselLoading, workspaceId }: { kesselLoading?: boolean; workspaceId?: string | undefined } = {},
  ) => {
    const mockReducer = (state = {}) => state;
    store = createStore(mockReducer);

    const contextValue = {
      workspaceId: workspaceId !== undefined ? workspaceId : 'test-workspace-id',
      isLoading: kesselLoading ?? false,
      permissions: {
        canWriteIntegrationsEndpoints: true,
        canReadIntegrationsEndpoints: true,
      },
      errors: [],
    };

    return render(
      <Provider store={store}>
        <KesselRbacAccessContext.Provider value={contextValue}>
          <PermissionsChecker>
            <Children />
          </PermissionsChecker>
        </KesselRbacAccessContext.Provider>
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({
      identity: { user: { is_org_admin: false } },
    });
    mockGetUserPermissions.mockResolvedValue([]);
  });

  it('renders children', () => {
    renderWithProviders();
    expect(screen.getByText('App')).toBeInTheDocument();
  });

  it('loads org admin status', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(actions.loadOrgAdmin).toHaveBeenCalledWith(mockGetUser);
    });
  });

  it('loads sources permissions via Chrome API', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(actions.loadWritePermissions).toHaveBeenCalledWith(mockGetUserPermissions);
    });
  });

  it('loads v1 integrations permissions immediately', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(actions.loadIntegrationsEndpointsPermissions).toHaveBeenCalledWith(mockGetUserPermissions);
      expect(actions.loadIntegrationsReadPermissions).toHaveBeenCalledWith(mockGetUserPermissions);
    });
  });

  it('loads v1 integrations permissions even while Kessel is still loading', async () => {
    renderWithProviders({ kesselLoading: true });

    await waitFor(() => {
      expect(actions.loadIntegrationsEndpointsPermissions).toHaveBeenCalledWith(mockGetUserPermissions);
      expect(actions.loadIntegrationsReadPermissions).toHaveBeenCalledWith(mockGetUserPermissions);
    });
  });

  describe('when Kessel workspace is available', () => {
    it('loads integrations permissions via Kessel', async () => {
      renderWithProviders({ workspaceId: 'test-workspace-id' });

      await waitFor(() => {
        expect(kesselActions.loadPermissionsFromKessel).toHaveBeenCalledWith({
          canWriteIntegrationsEndpoints: true,
          canReadIntegrationsEndpoints: true,
        });
      });
    });

    it('waits for Kessel to finish loading before dispatching', async () => {
      renderWithProviders({ kesselLoading: true });

      expect(kesselActions.loadPermissionsFromKessel).not.toHaveBeenCalled();
    });
  });

  describe('when Kessel workspace is not available', () => {
    it('does NOT dispatch Kessel permissions', async () => {
      renderWithProviders({ workspaceId: '' });

      await waitFor(() => {
        expect(actions.loadIntegrationsEndpointsPermissions).toHaveBeenCalled();
      });

      expect(kesselActions.loadPermissionsFromKessel).not.toHaveBeenCalled();
    });
  });
});
