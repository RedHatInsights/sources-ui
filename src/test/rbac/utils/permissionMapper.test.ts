import { mapKesselToV1Permissions } from '../../../rbac/utils/permissionMapper';
import { KesselRbacAccessContextValue } from '../../../rbac/KesselRbacAccessContext';

describe('permissionMapper', () => {
  describe('mapKesselToV1Permissions', () => {
    it('maps canWriteIntegrationsEndpoints to integrationsEndpointsPermissions', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: true,
        canReadIntegrationsEndpoints: false,
      };

      const result = mapKesselToV1Permissions(kesselPermissions);

      expect(result.integrationsEndpointsPermissions).toBe(true);
    });

    it('maps canReadIntegrationsEndpoints to integrationsReadPermissions', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: false,
        canReadIntegrationsEndpoints: true,
      };

      const result = mapKesselToV1Permissions(kesselPermissions);

      expect(result.integrationsReadPermissions).toBe(true);
    });

    it('maps all permissions correctly when all are true', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: true,
        canReadIntegrationsEndpoints: true,
      };

      const result = mapKesselToV1Permissions(kesselPermissions);

      expect(result).toEqual({
        integrationsEndpointsPermissions: true,
        integrationsReadPermissions: true,
      });
    });

    it('maps all permissions correctly when all are false', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: false,
        canReadIntegrationsEndpoints: false,
      };

      const result = mapKesselToV1Permissions(kesselPermissions);

      expect(result).toEqual({
        integrationsEndpointsPermissions: false,
        integrationsReadPermissions: false,
      });
    });

    it('preserves permission values exactly (no conversion)', () => {
      const kesselPermissions: KesselRbacAccessContextValue['permissions'] = {
        canWriteIntegrationsEndpoints: false,
        canReadIntegrationsEndpoints: true,
      };

      const result = mapKesselToV1Permissions(kesselPermissions);

      // Should map directly without any conversion
      expect(result.integrationsEndpointsPermissions).toBe(false);
      expect(result.integrationsReadPermissions).toBe(true);
    });
  });
});
