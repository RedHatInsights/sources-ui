import { selectOnlyEditedValues } from './helpers';
import { updateSource, loadEntities } from '../../redux/actions/providers';
import { paths } from '../../Routes';

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
        })
    }))
.then(() => {
    push(paths.sources);
    dispatch(loadEntities());
}).catch(_error => {
    push(paths.sources);
});
