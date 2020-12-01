import { checkAppAvailability } from '@redhat-cloud-services/frontend-components-sources/cjs/getApplicationStatus';

import { selectOnlyEditedValues } from './helpers';
import { loadEntities } from '../../redux/sources/actions';
import { checkSourceStatus } from '../../api/checkSourceStatus';
import { doUpdateSource } from '../../api/doUpdateSource';

import { UNAVAILABLE } from '../../views/formatters';

export const onSubmit = async (values, editing, dispatch, source, intl, setState) => {
  setState({ type: 'submit', values, editing });

  const startDate = new Date();

  try {
    await doUpdateSource(source, selectOnlyEditedValues(values, editing));
  } catch {
    await dispatch(loadEntities());
    setState({ type: 'submitFailed' });

    return;
  }

  checkSourceStatus(source.source.id);

  let message = {};
  let messages = {};

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
      await dispatch(loadEntities());
      setState({ type: 'submitFailed' });
      return;
    }

    statusResults.forEach(({ availability_status, availability_status_error, id, role: isEndpoint }) => {
      let updatedMessage;

      if (availability_status === UNAVAILABLE) {
        updatedMessage = {
          title: intl.formatMessage({
            id: 'wizard.failEditToastTitle',
            defaultMessage: 'Edit application credentials failed',
          }),
          description: availability_status_error,
          variant: 'danger',
        };
      }

      if (!availability_status) {
        updatedMessage = {
          title: intl.formatMessage({
            id: 'wizard.timeoutEditToastTitle',
            defaultMessage: 'Edit in progress',
          }),
          description: intl.formatMessage({
            id: 'wizard.timeoutEditToastDescription',
            defaultMessage:
              'We are still working to confirm your updated credentials. Changes will be reflected in this table when complete.',
          }),
          variant: 'warning',
        };
      }

      if (updatedMessage && isEndpoint) {
        message = updatedMessage;
      } else if (updatedMessage) {
        messages[id] = updatedMessage;
      }
    });
  }

  if (Object.keys(message).length === 0 && Object.keys(messages).length === 0) {
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
  }

  await dispatch(loadEntities());
  setState({ type: 'submitFinished', message, messages });
};
