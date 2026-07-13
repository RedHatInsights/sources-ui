# PagerDuty Alert Severity Field Removal Plan

## Overview
This document outlines the implementation plan for removing the "Alert severity" field from PagerDuty integrations across the HCC platform.

## Feature Flag
**Flag Name:** `platform.integrations.pager-duty.hide-severity`

**Purpose:** Hide the "Alert severity" field from all PagerDuty integration pages and wizards to enable synchronized removal across frontend, backend, documentation, and user communications.

## Implementation Status

### ✅ Frontend (sources-ui) - COMPLETED
The feature flag has been implemented in all components that load the IntegrationsWizard from the notifications microfrontend:

1. **`src/components/IntegrationsDropdown.js`** (Lines 54, 88)
   - Added `hidePagerDutySeverity` flag using `useFlag('platform.integrations.pager-duty.hide-severity')`
   - Passes `hidePagerDutySeverity` prop to IntegrationsWizard AsyncComponent

2. **`src/components/Widget/IntegrationsWidget.tsx`** (Lines 56, 295)
   - Added `hidePagerDutySeverity` flag using `useFlag('platform.integrations.pager-duty.hide-severity')`
   - Passes `hidePagerDutySeverity` prop to IntegrationsWizard AsyncComponent

3. **`src/components/Overview/CustomDataListItem.js`** (Lines 25, 34, 116)
   - Imported `useFlag` from '@unleash/proxy-client-react'
   - Added `hidePagerDutySeverity` flag using `useFlag('platform.integrations.pager-duty.hide-severity')`
   - Passes `hidePagerDutySeverity` prop to IntegrationsWizard AsyncComponent

### 🔄 Notifications Backend - PENDING
The notifications microfrontend needs to:

1. **Accept the `hidePagerDutySeverity` prop** in the IntegrationsWizard component
2. **Conditionally render** the "Alert severity" field based on the flag value:
   ```tsx
   // In IntegrationsWizard component
   {!hidePagerDutySeverity && (
     <FormGroup label="Alert severity" fieldId="alert-severity">
       {/* Alert severity field implementation */}
     </FormGroup>
   )}
   ```
3. **Update validation logic** to make the field optional when hidden
4. **Ensure backward compatibility** - existing integrations should continue to work

### 📝 Required Actions

#### Phase 1: Pre-Deployment (Flag OFF)
- [ ] Deploy sources-ui with feature flag support (this PR)
- [ ] Deploy notifications backend with feature flag support
- [ ] Create Unleash feature flag `platform.integrations.pager-duty.hide-severity` (default: OFF)
- [ ] Test flag toggle in staging/development environments

#### Phase 2: Coordination Day (Flag ON)
On the agreed coordination date:
1. [ ] **8:00 AM ET** - Enable feature flag in production
2. [ ] **8:00 AM ET** - Update backend API to stop requiring/processing severity field
3. [ ] **8:00 AM ET** - Publish documentation updates
4. [ ] **8:00 AM ET** - Send user announcement email
5. [ ] Monitor for issues throughout the day

#### Phase 3: Post-Removal Cleanup (2-4 weeks later)
- [ ] Remove feature flag code from frontend
- [ ] Remove feature flag code from backend
- [ ] Remove severity field from database schema (after migration period)
- [ ] Remove Unleash feature flag definition

## Testing Checklist

### Frontend Testing
- [ ] Feature flag OFF: Alert severity field is visible in PagerDuty wizard
- [ ] Feature flag ON: Alert severity field is hidden in PagerDuty wizard
- [ ] Feature flag ON: PagerDuty integration can be created without severity field
- [ ] Feature flag ON: Existing PagerDuty integrations can be edited without severity field
- [ ] Feature flag works correctly in:
  - [ ] IntegrationsDropdown (Create Integration button)
  - [ ] IntegrationsWidget (Home page widget)
  - [ ] Overview page (Getting started)

### Backend Testing (Notifications Team)
- [ ] Feature flag OFF: Severity field is required
- [ ] Feature flag ON: Severity field is optional/hidden
- [ ] Feature flag ON: API accepts PagerDuty integrations without severity field
- [ ] Feature flag ON: Existing integrations continue to function
- [ ] Feature flag ON: Severity field is ignored if provided

## Files Modified

### sources-ui Repository
- `src/components/IntegrationsDropdown.js`
- `src/components/Widget/IntegrationsWidget.tsx`
- `src/components/Overview/CustomDataListItem.js`

### notifications Repository (PENDING)
- `src/IntegrationsWizard/[component-path]` - Update to accept and handle `hidePagerDutySeverity` prop
- `src/api/[pagerduty-api]` - Update validation to make severity field optional

## Rollback Plan
If issues are discovered after enabling the flag:
1. Disable the feature flag in Unleash immediately
2. Field will reappear for all users
3. Investigate and fix issues
4. Re-enable when ready

## Communication Template

### User Announcement Email (Draft)
**Subject:** Important Update: PagerDuty Integration Configuration Change

Dear Red Hat Hybrid Cloud Console Users,

On [DATE], we will be removing the "Alert severity" field from PagerDuty integration configuration. This change simplifies the integration setup process while maintaining full functionality of your PagerDuty integrations.

**What's changing:**
- The "Alert severity" field will no longer appear when creating or editing PagerDuty integrations
- All existing PagerDuty integrations will continue to work without interruption
- No action is required on your part

**When:**
This change will take effect on [DATE] at [TIME] ET.

If you have any questions or concerns, please contact Red Hat Support.

Thank you,
The Red Hat Hybrid Cloud Console Team

---

## Additional Notes
- The feature flag approach allows for easy rollback if issues are discovered
- All components that load the IntegrationsWizard now pass the flag
- The flag is fetched once per component instance, so performance impact is minimal
- Consider adding analytics to track usage before/after the change
