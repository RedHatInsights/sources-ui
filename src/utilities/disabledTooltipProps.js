export const disabledMessage = (intl) =>
  intl.formatMessage({
    id: 'sources.notAdminButton',
    defaultMessage:
      'To perform this action, you must be granted Sources Administrator permissions from your Organization Administrator.',
  });

const disabledTooltipProps = (intl) => ({
  tooltip: disabledMessage(intl),
  isDisabled: true,
  className: 'src-m-dropdown-item-disabled',
});

export default disabledTooltipProps;
