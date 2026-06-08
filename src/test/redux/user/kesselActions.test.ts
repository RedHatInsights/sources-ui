import { loadPermissionsFromKessel } from '../../../redux/user/kesselActions';
import { KesselRbacAccessContextValue } from '../../../rbac/KesselRbacAccessContext';
import { ACTION_TYPES } from '../../../redux/user/actionTypes';

describe('kesselActions', () => {
  describe('loadPermissionsFromKessel', () => {
    let dispatch: jest.Mock;

    beforeEach(() => {
      dispatch = jest.fn();
    });

    it('dispatches integrations endpoints write permission', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: true,
        canReadIntegrationsEndpoints: false,
      };

      const action = loadPermissionsFromKessel(kesselPermissions);
      action(dispatch, jest.fn(), undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: (ACTION_TYPES as any).SET_INTEGRATIONS_ENDPOINTS_PERMISSIONS_FULFILLED,
        payload: true,
      });
    });

    it('dispatches integrations endpoints read permission', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: false,
        canReadIntegrationsEndpoints: true,
      };

      const action = loadPermissionsFromKessel(kesselPermissions);
      action(dispatch, jest.fn(), undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: (ACTION_TYPES as any).SET_INTEGRATIONS_READ_PERMISSIONS_FULFILLED,
        payload: true,
      });
    });

    it('dispatches both integrations permissions when both are true', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: true,
        canReadIntegrationsEndpoints: true,
      };

      const action = loadPermissionsFromKessel(kesselPermissions);
      action(dispatch, jest.fn(), undefined);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: (ACTION_TYPES as any).SET_INTEGRATIONS_ENDPOINTS_PERMISSIONS_FULFILLED,
        payload: true,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: (ACTION_TYPES as any).SET_INTEGRATIONS_READ_PERMISSIONS_FULFILLED,
        payload: true,
      });
    });

    it('dispatches both integrations permissions when both are false', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: false,
        canReadIntegrationsEndpoints: false,
      };

      const action = loadPermissionsFromKessel(kesselPermissions);
      action(dispatch, jest.fn(), undefined);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: (ACTION_TYPES as any).SET_INTEGRATIONS_ENDPOINTS_PERMISSIONS_FULFILLED,
        payload: false,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: (ACTION_TYPES as any).SET_INTEGRATIONS_READ_PERMISSIONS_FULFILLED,
        payload: false,
      });
    });

    it('does NOT dispatch sources permissions', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: true,
        canReadIntegrationsEndpoints: true,
      };

      const action = loadPermissionsFromKessel(kesselPermissions);
      action(dispatch, jest.fn(), undefined);

      // Should only dispatch 2 integrations permissions, NOT sources
      expect(dispatch).toHaveBeenCalledTimes(2);

      // Verify it's NOT dispatching sources permissions
      const calls = dispatch.mock.calls;
      const hasSourcesPermission = calls.some(
        (call: any[]) => call[0].type === (ACTION_TYPES as any).SET_WRITE_PERMISSIONS_FULFILLED
      );
      expect(hasSourcesPermission).toBe(false);
    });

    it('uses correct action types for integrations', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: true,
        canReadIntegrationsEndpoints: true,
      };

      const action = loadPermissionsFromKessel(kesselPermissions);
      action(dispatch, jest.fn(), undefined);

      const dispatchedTypes = dispatch.mock.calls.map((call: any[]) => call[0].type);

      expect(dispatchedTypes).toContain(
        (ACTION_TYPES as any).SET_INTEGRATIONS_ENDPOINTS_PERMISSIONS_FULFILLED
      );
      expect(dispatchedTypes).toContain((ACTION_TYPES as any).SET_INTEGRATIONS_READ_PERMISSIONS_FULFILLED);
    });
  });
});
