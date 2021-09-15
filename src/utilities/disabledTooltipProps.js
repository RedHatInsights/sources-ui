export const disabledMessage = (intl) =>
  intl.formatMessage({
    id: 'sources.notAdminButton',
    defaultMessage: 'To perform this action, you must be granted write permissions from your Organization Administrator.',
  });

const disabledTooltipProps = (intl) => ({
  tooltip: disabledMessage(intl),
  isDisabled: true,
  className: 'ins-c-sources__disabled-drodpown-item',
});

export default disabledTooltipProps;
