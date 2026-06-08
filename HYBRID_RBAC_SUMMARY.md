# Hybrid RBAC v1/v2 Implementation - Summary

## Overview

This implementation supports a **hybrid approach** to RBAC permissions:
- ✅ **Integrations**: Migrated to Kessel v2 (feature-flag based)
- ✅ **Sources**: Continues using Chrome API v1 (all orgs)

## Why Hybrid?

The sources service has **not yet migrated to Kessel**, so sources permissions must continue using the v1 Chrome API (`getUserPermissions('sources')`). Only integrations permissions can use Kessel v2.

## How It Works

### Permission Loading Flow

```
┌─────────────────────────────────────────────────────────────┐
│              PermissionsChecker Component                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─── Org Admin (all orgs)
                            │    └─> Chrome.getUser()
                            │
                            ├─── Sources Permissions (all orgs)
                            │    └─> Chrome.getUserPermissions('sources')
                            │        → Redux: user.writePermissions
                            │
                            └─── Integrations Permissions
                                 │
                                 ├─ v1 Orgs (flag OFF)
                                 │  └─> Chrome.getUserPermissions('integrations')
                                 │      → Redux: user.integrationsEndpointsPermissions
                                 │      → Redux: user.integrationsReadPermissions
                                 │
                                 └─ v2 Orgs (flag ON)
                                    └─> Kessel SDK
                                        → KesselRbacAccessContext
                                        → Mapped to Redux state
                                        → Redux: user.integrationsEndpointsPermissions
                                        → Redux: user.integrationsReadPermissions
```

### Feature Flag: `platform.rbac.workspaces`

- **OFF** (v1 org): All permissions via Chrome API
- **ON** (v2 org): Integrations via Kessel, Sources via Chrome API

## Implementation Details

### Files Modified

**Core:**
- `src/components/PermissionsChecker.tsx` - Hybrid permission loading logic
- `src/AppEntry.tsx` - Wrapped with Kessel providers

**Kessel Integration:**
- `src/rbac/KesselRbacAccessProvider.tsx` - Only checks integrations permissions
- `src/rbac/KesselRbacAccessContext.ts` - Context (integrations only)
- `src/rbac/kesselWorkspaceRelations.ts` - Integrations relations mapping
- `src/rbac/hooks/useDefaultWorkspace.ts` - Fetch workspace ID
- `src/rbac/utils/permissionMapper.ts` - Map integrations Kessel → Redux

**Redux:**
- `src/redux/user/kesselActions.ts` - Load integrations from Kessel to Redux

**Documentation:**
- `src/rbac/README.md` - Technical docs
- `RBAC_V2_MIGRATION.md` - Migration guide
- `HYBRID_RBAC_SUMMARY.md` - This file

### Permission Mappings

#### Integrations (v2 Ready)
| v1 Permission | v2 Kessel Relation | Redux State |
|--------------|-------------------|-------------|
| `integrations:endpoints:write` | `integrations_endpoints_edit` | `user.integrationsEndpointsPermissions` |
| `integrations:endpoints:read` | `integrations_endpoints_view` | `user.integrationsReadPermissions` |

Source: [`notifications.ksl`](https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl)

#### Sources (v1 Continues)
| v1 Permission | Redux State | Status |
|--------------|-------------|---------|
| `sources:*:write` or `sources:*:*` | `user.writePermissions` | ✅ Chrome API v1 |
| `sources:*:read` | N/A (not currently used) | ✅ Chrome API v1 |

## Code Snippets

### PermissionsChecker Logic

```typescript
const isV2Org = useFlag('platform.rbac.workspaces');

// Sources: Always v1 (all orgs)
useEffect(() => {
  dispatch(loadWritePermissions(getUserPermissions));
}, [getUserPermissions, dispatch]);

// Integrations: v1 or v2 based on flag
useEffect(() => {
  if (isV2Org && !isKesselLoading) {
    // v2: Use Kessel
    dispatch(loadPermissionsFromKessel(kesselPermissions));
  } else if (!isV2Org) {
    // v1: Use Chrome API
    dispatch(loadIntegrationsEndpointsPermissions(getUserPermissions));
    dispatch(loadIntegrationsReadPermissions(getUserPermissions));
  }
}, [isV2Org, isKesselLoading, kesselPermissions, getUserPermissions, dispatch]);
```

### Kessel Provider Setup

```typescript
<AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/kessel/v1beta2">
  <KesselRbacAccessProvider>
    <App />
  </KesselRbacAccessProvider>
</AccessCheck.Provider>
```

## Testing Checklist

### v1 Organization (Flag OFF)
- [ ] Sources write operations work (add/edit/delete source)
- [ ] Integrations write operations work (add/edit integrations)
- [ ] Integrations read operations work (view integrations)
- [ ] Permission-based UI hiding works correctly
- [ ] No Kessel API calls made

### v2 Organization (Flag ON)
- [ ] Sources write operations work (Chrome API)
- [ ] Integrations write operations work (Kessel SDK)
- [ ] Integrations read operations work (Kessel SDK)
- [ ] Permission-based UI hiding works correctly
- [ ] Kessel API calls to `/api/kessel/v1beta2`
- [ ] Workspace fetched from `/api/rbac/v2/workspaces/`

### Component Tests
- [ ] SourcesTable shows/hides actions based on permissions
- [ ] IntegrationsDropdown shows/hides based on permissions
- [ ] TabNavigation shows/hides integrations tab
- [ ] RedirectNoWriteAccess redirects correctly
- [ ] SourcesHeader buttons enabled/disabled correctly

## Deployment

### Phase 1: Deploy Code ✅
- Hybrid implementation deployed
- Feature flag `platform.rbac.workspaces` OFF by default
- All orgs use v1 (sources via Chrome, integrations via Chrome)
- **No behavior change for users**

### Phase 2: Enable for Test Orgs
- Enable `platform.rbac.workspaces` for test orgs
- Validate:
  - Integrations permissions work via Kessel
  - Sources permissions still work via Chrome
  - No errors in console

### Phase 3: Gradual Rollout
- Enable flag for % of production orgs
- Monitor Kessel API calls
- Monitor error rates

## Future: Sources Migration to Kessel

When the sources service team migrates to Kessel:

1. **Backend**: Sources team creates `sources.ksl` in rbac-config
2. **Frontend Changes Needed**:
   - Add sources relations to `kesselWorkspaceRelations.ts`
   - Add sources permission checks to `KesselRbacAccessProvider.tsx`
   - Update `PermissionsChecker.tsx` to use Kessel for sources (when flag ON)
   - Update `permissionMapper.ts` to include sources permissions
   - Update `kesselActions.ts` to dispatch sources permissions

3. **Testing**: Same checklist as above, but sources now via Kessel for v2 orgs

## Key Benefits

✅ **Backward Compatible**: v1 orgs unchanged  
✅ **Progressive Migration**: Integrations migrated, sources when ready  
✅ **No Component Changes**: Redux state structure unchanged  
✅ **Safe Rollout**: Feature flag controlled  
✅ **Clear Separation**: Hybrid approach clearly documented  

## Contact

- **Integrations v2 migration**: Platform RBAC team
- **Sources future migration**: Sources service team
- **Frontend questions**: sources-ui maintainers
