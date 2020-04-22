import { selectOnlyEditedValues } from './helpers';
import { updateSource, loadEntities } from '../../redux/sources/actions';
import { routes } from '../../Routes';
import { checkSourceStatus } from '../../api/checkSourceStatus';

export const onSubmit = (values, editing, dispatch, source, intl, push) => dispatch(updateSource(
    source,
    selectOnlyEditedValues(values, editing),
    intl.formatMessage({
        id: 'sources.modifiedNotificationTitle',
        defaultMessage: `"{ name }" was modified successfully.`
    }, { name: source.source.name }),
    intl.formatMessage({
        id: 'sources.modifiedNotificationDescription',
        defaultMessage: 'The source was successfully modified.'
    }),
    {
        authentication: intl.formatMessage({
            id: 'sources.sourceEditAuthFailure',
            defaultMessage: 'Authentication update failure.'
        }),
        source: intl.formatMessage({
            id: 'sources.sourceEditFailure',
            defaultMessage: 'Source update failure.'
        }),
        endpoint: intl.formatMessage({
            id: 'sources.sourceEditEndpointFailure',
            defaultMessage: 'Endpoint update failure.'
        }),
        costManagement: intl.formatMessage({
            id: 'sources.sourceCostmanagementFailure',
            defaultMessage: 'Cost Management update failure.'
        })
    }))
.then(() => {
    checkSourceStatus(source.source.id);
    push(routes.sources.path);
    dispatch(loadEntities());
});
