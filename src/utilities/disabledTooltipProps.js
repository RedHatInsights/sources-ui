export const disabledMessage = (intl, isOrgAdmin) =>
  isOrgAdmin
    ? intl.formatMessage({
        id: 'sources.notAdminButton',
        defaultMessage: 'To perform this action, you must add Sources Administrator permissions to your user.',
      })
    : intl.formatMessage({
        id: 'sources.notWritePermissionButton',
        defaultMessage:
          'To perform this action, your Organization Administrator must grant you Sources Administrator permissions.',
      });

const disabledTooltipProps = (intl, isOrgAdmin) => ({
  tooltip: disabledMessage(intl, isOrgAdmin),
  isDisabled: true,
  className: 'src-m-dropdown-item-disabled',
});

export default disabledTooltipProps;
