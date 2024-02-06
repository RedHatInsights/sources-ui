export const disabledMessage = (intl, isOrgAdmin) =>
  isOrgAdmin
    ? intl.formatMessage({
        id: 'sources.notAdminButton',
        defaultMessage: 'To perform this action, you must add Cloud Integration Administrator permissions to your user.',
      })
    : intl.formatMessage({
        id: 'sources.notWritePermissionButton',
        defaultMessage:
          'To perform this action, your Organization Administrator must grant you Cloud Integration Administrator permissions.',
      });

const disabledTooltipProps = (intl, isOrgAdmin) => ({
  // need both for table actions and regular dropdowns
  // FIXME: Make it configurable or split the implementation
  tooltipProps: { content: disabledMessage(intl, isOrgAdmin) },
  tooltip: disabledMessage(intl, isOrgAdmin),
  isDisabled: true,
  className: 'src-m-dropdown-item-disabled',
});

export default disabledTooltipProps;
