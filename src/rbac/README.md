# RBAC v2 Migration with Kessel SDK

This directory contains the implementation for RBAC v2 using the Kessel SDK, allowing the application to work with both RBAC v1 and v2 organizations.

## Overview

The application now supports both RBAC v1 (legacy) and v2 (Kessel-based) permission checks using a **hybrid approach**:

- **Integrations permissions**: Switches based on `platform.rbac.workspaces` feature flag (v1 → v2)
- **Sources permissions**: Always uses Chrome API v1 until sources service migrates to Kessel

## Architecture

### Feature Flag Detection (Hybrid Approach)

**For Integrations permissions:**
- **v1 orgs**: `platform.rbac.workspaces` = `false` → Uses Chrome's `getUserPermissions('integrations')`
- **v2 orgs**: `platform.rbac.workspaces` = `true` → Uses Kessel SDK

**For Sources permissions:**
- **All orgs**: Always uses Chrome's `getUserPermissions('sources')` until sources service migrates

### Files Structure

```
src/rbac/
├── README.md                           # This file
├── KesselRbacAccessContext.ts          # React context for Kessel permissions
├── KesselRbacAccessProvider.tsx        # Provider that fetches workspace and permissions
├── kesselWorkspaceRelations.ts         # v1 → v2 permission mapping constants
├── hooks/
│   └── useDefaultWorkspace.ts          # Hook to fetch default workspace ID
└── utils/
    └── permissionMapper.ts             # Maps Kessel v2 perms to Redux v1 state
```

### Permission Mapping

#### Sources Permissions (Continues using v1)
| v1 Permission | Status |
|--------------|--------|
| `sources:*:*` or `sources:*:write` | ✅ Uses Chrome API v1 (all orgs) |
| `sources:*:read` | ✅ Uses Chrome API v1 (all orgs) |

**Note**: Sources permissions will continue using Chrome's `getUserPermissions('sources')` until the sources service migrates to Kessel. No v2 schema needed yet.

#### Integrations Permissions (Migrated to v2)
| v1 Permission | v2 Relation | Kessel Permission |
|--------------|------------|-------------------|
| `integrations:endpoints:write` | `integrations_endpoints_edit` | `canWriteIntegrationsEndpoints` |
| `integrations:endpoints:read` | `integrations_endpoints_view` | `canReadIntegrationsEndpoints` |

### Redux State Mapping

Kessel v2 permissions are mapped to the existing Redux state structure in `user` reducer:

```javascript
// Redux state (unchanged from v1)
{
  user: {
    writePermissions: boolean,              // Maps to canWriteSources
    integrationsEndpointsPermissions: boolean,  // Maps to canWriteIntegrationsEndpoints
    integrationsReadPermissions: boolean,   // Maps to canReadIntegrationsEndpoints
    orgAdmin: boolean                       // Fetched from Chrome (same for both v1/v2)
  }
}
```

## How It Works

### 1. App Initialization (AppEntry.tsx)
```tsx
<AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/kessel/v1beta2">
  <KesselRbacAccessProvider>
    <App />
  </KesselRbacAccessProvider>
</AccessCheck.Provider>
```

### 2. Permission Loading (PermissionsChecker.tsx) - Hybrid Approach
```tsx
const isV2Org = useFlag('platform.rbac.workspaces');

// Sources permissions: Always use v1 Chrome API (all orgs)
dispatch(loadWritePermissions(getUserPermissions));

// Integrations permissions: Use v2 for v2 orgs, v1 for v1 orgs
if (isV2Org && !isKesselLoading) {
  // v2 org: Load integrations from Kessel
  dispatch(loadPermissionsFromKessel(kesselPermissions));
} else if (!isV2Org) {
  // v1 org: Load integrations from Chrome API
  dispatch(loadIntegrationsEndpointsPermissions(getUserPermissions));
  dispatch(loadIntegrationsReadPermissions(getUserPermissions));
}
```

### 3. Permission Checks (Unchanged in Components)
Components continue using the same Redux selectors:

```javascript
const writePermissions = useSelector(({ user }) => user?.writePermissions);
const hasIntegrationsPermissions = useSelector(({ user }) => user?.integrationsEndpointsPermissions);
```

## Sources Service Migration Status

**Sources permissions will continue using Chrome API v1** until the sources service itself migrates to Kessel. This is expected and intentional.

### Important: sources ≠ content-sources

**Do not confuse these two different apps:**
- **`sources`** (this app) - Integration sources for Hybrid Cloud Console
  - Calls: `getUserPermissions('sources')`
  - Permissions: `sources:*:write`, `sources:*:read`
  - **Status**: ⏳ Continues using v1 until service migration

- **`content-sources`** (different app) - Content management (repositories, templates)
  - Has schema: [`content-sources.ksl`](https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/content-sources.ksl)
  - Permissions: `content_sources_repository_view`, `content_sources_template_edit`, etc.
  - **Status**: ✅ Already has v2 schema

### Future Migration (when sources service is ready):
1. Sources team will create `sources.ksl` in [rbac-config](https://github.com/RedHatInsights/rbac-config)
2. Define v1 → v2 permission mappings
3. Update this codebase to use Kessel for sources permissions

## Testing

### v1 Organization (Feature Flag Off)
- Permissions loaded via Chrome API `getUserPermissions()`
- Existing behavior unchanged

### v2 Organization (Feature Flag On)
- Permissions loaded via Kessel SDK
- Workspace fetched from `/api/rbac/v2/workspaces/?type=default`
- Access checks via `/api/kessel/v1beta2` endpoints

### Test Checklist
- [ ] Sources write operations (add/edit/delete source)
- [ ] Sources read operations (view sources list)
- [ ] Integrations endpoints write (add/edit integrations)
- [ ] Integrations endpoints read (view integrations)
- [ ] Permission-based UI hiding (buttons, tabs, etc.)
- [ ] Redirect for users without write access

## Related PRs
- insights-chrome: [PR #3559](https://github.com/RedHatInsights/insights-chrome/pull/3559) - Skip v1 RBAC for v2 orgs
- notifications-frontend: Reference implementation for Kessel SDK integration

## References
- [Kessel SDK Documentation](https://www.npmjs.com/package/@project-kessel/react-kessel-access-check)
- [rbac-config Repository](https://github.com/RedHatInsights/rbac-config)
- [notifications.ksl Schema](https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl)
