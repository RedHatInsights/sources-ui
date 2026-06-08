# RBAC v2 Migration Guide

This document describes the migration from Chrome API's `getUserPermissions()` (RBAC v1) to Kessel SDK (RBAC v2) for permission checks.

## What Changed

### Before (RBAC v1)
- Used Chrome's `getUserPermissions('sources')` and `getUserPermissions('integrations')`
- Checked string-based permissions: `sources:*:*`, `sources:*:write`, `integrations:endpoints:write`
- Required insights-chrome to make RBAC v1 API calls

### After (Hybrid RBAC v1 + v2 Support)
- **Integrations permissions**: Feature-flag based - uses v1 **OR** v2 based on `platform.rbac.workspaces` flag
  - For v2 orgs: Uses Kessel SDK with workspace-based permission checks
  - For v1 orgs: Continues using Chrome API (backward compatible)
- **Sources permissions**: Always uses Chrome API v1 (all orgs) until sources service migrates
- **No changes required** in existing components - Redux state structure unchanged

## Files Modified

### New Files
```
src/rbac/
├── KesselRbacAccessContext.ts          # Context for Kessel v2 permissions
├── KesselRbacAccessProvider.tsx        # Provider component
├── kesselWorkspaceRelations.ts         # v1 ↔ v2 permission mappings
├── hooks/useDefaultWorkspace.ts        # Fetch workspace ID
└── utils/permissionMapper.ts           # Map Kessel perms to Redux state

src/redux/user/kesselActions.js          # Redux action for v2 permissions
```

### Modified Files
```
package.json                             # Added @project-kessel/react-kessel-access-check
src/AppEntry.js → src/AppEntry.tsx      # Wrapped with Kessel providers
src/components/PermissionsChecker.js → .tsx  # Added v1/v2 branching logic
```

### Deleted Files
```
src/AppEntry.js                         # Replaced with .tsx version
src/components/PermissionsChecker.js    # Replaced with .tsx version
```

## How It Works

### 1. Feature Flag Detection
```typescript
const isV2Org = useFlag('platform.rbac.workspaces');
```

### 2. Permission Loading (Hybrid Approach)

**Sources Permissions (All orgs - always v1):**
```javascript
// Always uses Chrome API until sources service migrates
getUserPermissions('sources', true)
  .then(permissions => {
    const hasWrite = permissions.includes('sources:*:write');
    dispatch(setWritePermissions(hasWrite));
  });
```

**Integrations Permissions (Flag-based):**

v1 Orgs (flag = false):
```javascript
getUserPermissions('integrations', true)
  .then(permissions => {
    const hasWrite = permissions.includes('integrations:endpoints:write');
    dispatch(setIntegrationsEndpointsPermissions(hasWrite));
  });
```

v2 Orgs (flag = true):
```javascript
// Kessel SDK fetches workspace and checks permissions
const { permissions } = useKesselRbacAccess();
// permissions.canWriteIntegrationsEndpoints → mapped to integrationsEndpointsPermissions
dispatch(loadPermissionsFromKessel(permissions));
```

### 3. Redux State (Unchanged)
```javascript
state.user = {
  writePermissions: boolean,              // sources:*:write
  integrationsEndpointsPermissions: boolean,  // integrations:endpoints:write
  integrationsReadPermissions: boolean,   // integrations:endpoints:read
  orgAdmin: boolean
}
```

## Permission Mappings

### Sources (✅ Continues using v1)
| v1 Permission | Status |
|--------------|--------|
| `sources:*:*` or `sources:*:write` | ✅ Uses Chrome API v1 (all orgs) |
| `sources:*:read` | ✅ Uses Chrome API v1 (all orgs) |

> **Note**: Sources permissions will continue using `getUserPermissions('sources')` until the sources service migrates to Kessel. This is expected and no action needed.

### Integrations (✅ Migrated to v2)
| v1 Permission | v2 Relation | Context Permission |
|--------------|------------|-------------------|
| `integrations:endpoints:write` | `integrations_endpoints_edit` | `canWriteIntegrationsEndpoints` |
| `integrations:endpoints:read` | `integrations_endpoints_view` | `canReadIntegrationsEndpoints` |

## Testing Strategy

### Local Testing
1. **v1 org simulation**: Feature flag off (default)
   - Verify permissions load via Chrome API
   - Test all CRUD operations

2. **v2 org simulation**: Enable `platform.rbac.workspaces` flag
   - Verify Kessel SDK initializes
   - Check workspace fetch from `/api/rbac/v2/workspaces/`
   - Verify permission checks via `/api/kessel/v1beta2`

### Test Cases
- [ ] User with write access can add/edit/delete sources
- [ ] User without write access sees read-only view
- [ ] Integrations tab shows/hides based on permissions
- [ ] Permission-based redirects work (RedirectNoWriteAccess)
- [ ] Org admin status loads correctly (both v1 and v2)

## Deployment Strategy

### Phase 1: Deploy Code (This PR)
- Code supports both v1 and v2
- Feature flag `platform.rbac.workspaces` is **OFF** by default
- All orgs continue using v1 RBAC (no change in behavior)

### Phase 2: Test v2 on Staging
- Enable flag for specific test orgs
- Validate permission checks work correctly
- Monitor for errors in Kessel SDK calls

### Phase 3: Gradual Rollout
- Enable flag for % of production orgs
- Monitor metrics and error rates
- Full rollout once validated

## Known Issues & TODOs

### ✅ Sources Permissions - No Action Needed
**Status**: Sources will continue using Chrome API v1 until the service migrates

**Important**: Do NOT confuse with [`content-sources.ksl`](https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/content-sources.ksl) - that is for a **different app** (content management for repositories/templates). This sources-ui app uses `getUserPermissions('sources')`, not `getUserPermissions('content_sources')`.

**Impact**: None - sources permissions work the same for both v1 and v2 orgs

**Future Migration**: When the sources service team decides to migrate to Kessel, they will:
1. Create `sources.ksl` in rbac-config
2. Notify us to update this codebase to use Kessel for sources permissions

### TypeScript Strictness
Some files were migrated from `.js` to `.tsx` and may need type annotations:
- `PermissionsChecker.tsx` - children prop type
- Redux action types

## Rollback Plan

If issues are discovered after v2 rollout:

1. **Immediate**: Disable `platform.rbac.workspaces` flag
   - Orgs revert to v1 RBAC via Chrome API
   - No code deployment needed

2. **If Kessel SDK has bugs**: 
   - Code still supports v1 path
   - Can revert PR and remove Kessel SDK dependency

## Related Work

- **insights-chrome PR**: [#3559](https://github.com/RedHatInsights/insights-chrome/pull/3559) - Stops v1 API calls for v2 orgs
- **notifications-frontend**: Reference implementation we based this on
- **rbac-config**: Will need `sources.ksl` schema PR

## References

- [Kessel SDK](https://www.npmjs.com/package/@project-kessel/react-kessel-access-check)
- [rbac-config schemas](https://github.com/RedHatInsights/rbac-config/tree/master/configs/prod/schemas/src)
- [notifications.ksl example](https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl)

## Questions?

- Kessel SDK issues: @project-kessel team
- RBAC v2 migration: Platform RBAC team
- sources-ui specific: @sources-ui maintainers
