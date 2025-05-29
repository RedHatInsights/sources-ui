import disabledTooltipProps from './disabledTooltipProps';
import { pauseSource, resumeSource } from '../redux/sources/actions';
import { replaceRouteId, routes } from '../Routing';

export const linkBasename = '/settings/integrations';
export const mergeToBasename = (to, basename) => {
  if (typeof to === 'string') {
    // replace possible "//" after basename
    return `${basename}/${to}`.replaceAll('//', '/');
  }

  return {
    ...to,
    pathname: `${basename}/${to.pathname}`.replaceAll('//', '/'),
  };
};

export const actionResolver = (intl, navigate, hasWritePermissions, dispatch, isOrgAdmin) => (rowData) => {
  const disabledProps = disabledTooltipProps(intl, isOrgAdmin);
  const actions = [];

  if (rowData.paused_at) {
    actions.push({
      title: intl.formatMessage({
        id: 'sources.resume',
        defaultMessage: 'Resume',
      }),
      description: intl.formatMessage({
        id: 'sources.resume.description',
        defaultMessage: 'Unpause data collection for this integration',
      }),
      onClick: (_ev, _i, { id }) => dispatch(resumeSource(id, rowData.originalName, intl)),
      ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
    });
  } else {
    actions.push({
      title: intl.formatMessage({
        id: 'sources.pause',
        defaultMessage: 'Pause',
      }),
      description: intl.formatMessage({
        id: 'sources.pause.description',
        defaultMessage: 'Temporarily disable data collection',
      }),
      onClick: (_ev, _i, { id }) => dispatch(pauseSource(id, rowData.originalName, intl)),
      ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
    });
  }

  actions.push({
    title: intl.formatMessage({
      id: 'sources.remove',
      defaultMessage: 'Remove',
    }),
    description: intl.formatMessage({
      id: 'sources.remove.description',
      defaultMessage: 'Permanently delete this integration and all collected data',
    }),
    onClick: (_ev, _i, { id }) => navigate(replaceRouteId(routes.sourcesRemove.path, id)),
    ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
  });

  actions.push({
    title: !rowData.paused_at
      ? intl.formatMessage({
          id: 'sources.edit',
          defaultMessage: 'Edit',
        })
      : intl.formatMessage({
          id: 'sources.viewDetails',
          defaultMessage: 'View details',
        }),
    onClick: (_ev, _i, { id }) => navigate(replaceRouteId(routes.sourcesDetail.path, id)),
    ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
  });

  return actions;
};
