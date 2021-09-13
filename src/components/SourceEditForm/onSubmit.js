import { CHECK_ENDPOINT_COMMAND, getEditedApplications, selectOnlyEditedValues } from './helpers';
import { loadEntities } from '../../redux/sources/actions';
import { checkSourceStatus } from '../../api/checkSourceStatus';
import { doUpdateSource } from '../../api/doUpdateSource';
import { checkAppAvailability } from '../../api/getApplicationStatus';

import { AVAILABLE, IN_PROGRESS, UNAVAILABLE } from '../../views/formatters';

export const onSubmit = async (values, editing, dispatch, source, intl, setState) => {
  setState({ type: 'submit', values, editing });

  const startDate = new Date();

  try {
    await doUpdateSource(source, selectOnlyEditedValues(values, editing), values);
  } catch {
    await dispatch(loadEntities());
    setState({ type: 'submitFailed' });

    return;
  }

  checkSourceStatus(source.source.id);

  let messages = {};

  const checkApplications = getEditedApplications(source, editing);

  const promises = [];

  checkApplications.forEach((checkInfo) => {
    if (checkInfo.includes(CHECK_ENDPOINT_COMMAND)) {
      promises.push(
        checkAppAvailability(source.endpoints[0].id, undefined, undefined, 'getEndpoint', startDate).then((data) => ({
          ...data,
          id: checkInfo.replace(`${CHECK_ENDPOINT_COMMAND}-`, ''),
        }))
      );
    } else {
      promises.push(checkAppAvailability(checkInfo, undefined, undefined, undefined, startDate));
    }
  });

  let statusResults;
  if (promises.length > 0) {
    try {
      statusResults = await Promise.all(promises);
    } catch (error) {
      await dispatch(loadEntities());
      setState({ type: 'submitFailed' });
      return;
    }

    statusResults.forEach(({ availability_status, availability_status_error, id }) => {
      if (availability_status === AVAILABLE) {
        messages[id] = {
          title: intl.formatMessage({
            id: 'wizard.successEditToastTitle',
            defaultMessage: 'Application credentials were edited successfully.',
          }),
          description: availability_status_error,
          variant: 'success',
        };
      }

      if (availability_status === UNAVAILABLE) {
        messages[id] = {
          title: intl.formatMessage({
            id: 'wizard.failEditToastTitle',
            defaultMessage: 'Edit application credentials failed.',
          }),
          description: availability_status_error,
          variant: 'danger',
        };
      }

      if (!availability_status || availability_status === IN_PROGRESS) {
        messages[id] = {
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
    });
  }

  await dispatch(loadEntities());
  setState({ type: 'submitFinished', messages });
};
