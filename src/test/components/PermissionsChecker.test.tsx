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

// Mock Unleash flag
const mockUseFlag = jest.fn();
jest.mock('@unleash/proxy-client-react', () => ({
  useFlag: () => mockUseFlag(),
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

describe('PermissionsChecker - Hybrid RBAC', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  const mockKesselContext = {
    workspaceId: 'test-workspace-id',
    isLoading: false,
    permissions: {
      canWriteIntegrationsEndpoints: true,
      canReadIntegrationsEndpoints: true,
    },
    errors: [],
  };

  const Children = () => <h1>App</h1>;

  const renderWithProviders = (kesselLoading = false) => {
    const mockReducer = (state = {}) => state;
    store = createStore(mockReducer);

    const contextValue = {
      ...mockKesselContext,
      isLoading: kesselLoading,
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

  describe('v1 Organization (feature flag OFF)', () => {
    beforeEach(() => {
      mockUseFlag.mockReturnValue(false); // platform.rbac.workspaces = false
    });

    it('loads sources permissions via Chrome API', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(actions.loadWritePermissions).toHaveBeenCalledWith(mockGetUserPermissions);
      });
    });

    it('loads integrations permissions via Chrome API', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(actions.loadIntegrationsEndpointsPermissions).toHaveBeenCalledWith(mockGetUserPermissions);
        expect(actions.loadIntegrationsReadPermissions).toHaveBeenCalledWith(mockGetUserPermissions);
      });
    });

    it('loads org admin status', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(actions.loadOrgAdmin).toHaveBeenCalledWith(mockGetUser);
      });
    });

    it('does NOT load permissions from Kessel', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(kesselActions.loadPermissionsFromKessel).not.toHaveBeenCalled();
      });
    });

    it('renders children', () => {
      renderWithProviders();
      expect(screen.getByText('App')).toBeInTheDocument();
    });
  });

  describe('v2 Organization (feature flag ON)', () => {
    beforeEach(() => {
      mockUseFlag.mockReturnValue(true); // platform.rbac.workspaces = true
    });

    it('loads sources permissions via Chrome API (not Kessel)', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(actions.loadWritePermissions).toHaveBeenCalledWith(mockGetUserPermissions);
      });
    });

    it('loads integrations permissions via Kessel SDK', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(kesselActions.loadPermissionsFromKessel).toHaveBeenCalledWith(mockKesselContext.permissions);
      });
    });

    it('does NOT load integrations via Chrome API', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(kesselActions.loadPermissionsFromKessel).toHaveBeenCalled();
        expect(actions.loadIntegrationsEndpointsPermissions).not.toHaveBeenCalled();
        expect(actions.loadIntegrationsReadPermissions).not.toHaveBeenCalled();
      });
    });

    it('waits for Kessel to finish loading before dispatching', async () => {
      renderWithProviders(true); // isLoading = true

      // Should not dispatch while loading
      expect(kesselActions.loadPermissionsFromKessel).not.toHaveBeenCalled();
    });

    it('loads org admin status', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(actions.loadOrgAdmin).toHaveBeenCalledWith(mockGetUser);
      });
    });

    it('renders children', () => {
      renderWithProviders();
      expect(screen.getByText('App')).toBeInTheDocument();
    });
  });

  describe('Hybrid Behavior Verification', () => {
    it('v1 org: all permissions from Chrome API', async () => {
      mockUseFlag.mockReturnValue(false);
      renderWithProviders();

      await waitFor(() => {
        // Sources via Chrome
        expect(actions.loadWritePermissions).toHaveBeenCalled();

        // Integrations via Chrome
        expect(actions.loadIntegrationsEndpointsPermissions).toHaveBeenCalled();
        expect(actions.loadIntegrationsReadPermissions).toHaveBeenCalled();

        // NOT via Kessel
        expect(kesselActions.loadPermissionsFromKessel).not.toHaveBeenCalled();
      });
    });

    it('v2 org: sources via Chrome, integrations via Kessel', async () => {
      mockUseFlag.mockReturnValue(true);
      renderWithProviders();

      await waitFor(() => {
        // Sources via Chrome (always)
        expect(actions.loadWritePermissions).toHaveBeenCalled();

        // Integrations via Kessel
        expect(kesselActions.loadPermissionsFromKessel).toHaveBeenCalled();

        // Integrations NOT via Chrome
        expect(actions.loadIntegrationsEndpointsPermissions).not.toHaveBeenCalled();
        expect(actions.loadIntegrationsReadPermissions).not.toHaveBeenCalled();
      });
    });
  });
});
