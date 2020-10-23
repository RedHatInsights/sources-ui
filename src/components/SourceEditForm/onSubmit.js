import { checkAppAvailability } from '@redhat-cloud-services/frontend-components-sources/cjs/getApplicationStatus';

import { selectOnlyEditedValues } from './helpers';
import { loadEntities } from '../../redux/sources/actions';
import { checkSourceStatus } from '../../api/checkSourceStatus';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';
import { doUpdateSource } from '../../api/doUpdateSource';

import { UNAVAILABLE } from '../SourcesTable/formatters';

export const onSubmit = async (values, editing, dispatch, source, intl, setState) => {
    setState({ type: 'submit', values, editing });

    try {
        await doUpdateSource(source, selectOnlyEditedValues(values, editing));
    } catch {
        setState({ type: 'submitFailed' });

        return;
    }

    checkSourceStatus(source.source.id);
    dispatch(loadEntities());

    let message;

    const sourceData = await doLoadSourceForEdit({ id: source.source.id });

    const promises = source.applications?.map(({ id }) => checkAppAvailability(id)) || [];

    let statusResults;
    if (promises.length > 0) {
        try {
            statusResults = await Promise.all(promises);
        } catch (error) {
            setState({ type: 'submitFailed' });

            return;
        }

        const unavailableApp = statusResults.find(({ availability_status }) => availability_status === UNAVAILABLE);

        if (unavailableApp) {
            message = {
                title: intl.formatMessage({
                    id: 'wizard.failEditToastTitle',
                    defaultMessage: 'Edit source failed'
                }),
                description: unavailableApp.availability_status_error,
                variant: 'danger'
            };

            setState({ type: 'submitFinished', source: sourceData, message });

            return;
        }

        const anyTimetouted = statusResults.some(({ availability_status }) => !availability_status);

        if (anyTimetouted) {
            setState({ type: 'submitTimetouted' });

            return;
        }
    }

    message = {
        title: intl.formatMessage({
            id: 'wizard.successEditToastTitle',
            defaultMessage: 'Source ‘{name}’ was edited successfully.'
        }, { name: source.source.name }),
        variant: 'success'
    };

    setState({ type: 'submitFinished', source: sourceData, message });
};
