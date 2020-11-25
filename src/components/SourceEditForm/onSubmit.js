import { checkAppAvailability } from '@redhat-cloud-services/frontend-components-sources/cjs/getApplicationStatus';

import { selectOnlyEditedValues } from './helpers';
import { loadEntities } from '../../redux/sources/actions';
import { checkSourceStatus } from '../../api/checkSourceStatus';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';
import { doUpdateSource } from '../../api/doUpdateSource';

import { UNAVAILABLE } from '../../views/formatters';

export const onSubmit = async (values, editing, dispatch, source, intl, setState, hasCostManagement) => {
  setState({ type: 'submit', values, editing });

  const startDate = new Date();

  try {
    await doUpdateSource(source, selectOnlyEditedValues(values, editing));
  } catch {
    dispatch(loadEntities());
    setState({ type: 'submitFailed' });

    return;
  }

  checkSourceStatus(source.source.id);

  let message;

  const sourceData = await doLoadSourceForEdit({ id: source.source.id }, hasCostManagement);

  const promises =
    source.applications?.map(({ id }) => checkAppAvailability(id, undefined, undefined, undefined, startDate)) || [];

  if (source.endpoints?.[0]?.id) {
    promises.push(checkAppAvailability(source.endpoints[0].id, undefined, undefined, 'getEndpoint', startDate));
  }

  let statusResults;
  if (promises.length > 0) {
    try {
      statusResults = await Promise.all(promises);
    } catch (error) {
      dispatch(loadEntities());
      setState({ type: 'submitFailed' });
      return;
    }

    const unavailableApp = statusResults.find(({ availability_status }) => availability_status === UNAVAILABLE);

    if (unavailableApp) {
      message = {
        title: intl.formatMessage({
          id: 'wizard.failEditToastTitle',
          defaultMessage: 'Edit source failed',
        }),
        description: unavailableApp.availability_status_error,
        variant: 'danger',
      };

      setState({ type: 'submitFinished', source: sourceData, message });
      dispatch(loadEntities());
      return;
    }

    const anyTimetouted = statusResults.some(({ availability_status }) => !availability_status);

    if (anyTimetouted) {
      setState({ type: 'submitTimetouted', source: sourceData });
      dispatch(loadEntities());
      return;
    }
  }

  message = {
    title: intl.formatMessage(
      {
        id: 'wizard.successEditToastTitle',
        defaultMessage: 'Source ‘{name}’ was edited successfully.',
      },
      { name: source.source.name }
    ),
    variant: 'success',
  };

  setState({ type: 'submitFinished', source: sourceData, message });
  dispatch(loadEntities());
};
