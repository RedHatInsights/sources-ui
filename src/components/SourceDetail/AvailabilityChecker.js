import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import RedoIcon from '@patternfly/react-icons/dist/esm/icons/redo-icon';
import { Button } from '@patternfly/react-core/dist/esm/components/Button/Button';
import { Spinner } from '@patternfly/react-core/dist/esm/components/Spinner/Spinner';

import { useSource } from '../../hooks/useSource';
import checkSourceStatus from '../../api/checkSourceStatus';
import { addMessage } from '../../redux/sources/actions';

const AvailabilityChecker = () => {
  const source = useSource();
  const intl = useIntl();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="plain"
      aria-label={intl.formatMessage({ id: 'sources.checkavailability', defaultMessage: 'Check source availability' })}
      onClick={async () => {
        setLoading(true);
        await checkSourceStatus(source.id);
        setLoading(false);
        dispatch(
          addMessage({
            title: intl.formatMessage({
              id: 'sources.checkavailability.notificationTitle',
              defaultMessage: 'Request to check source status was sent',
            }),
            variant: 'info',
            description: intl.formatMessage({
              id: 'sources.checkavailability.notificationDescription',
              defaultMessage: 'Check this page later for updates',
            }),
          })
        );
      }}
      isDisabled={loading}
    >
      {!loading && <RedoIcon />}
      {loading && <Spinner size="md" />}
    </Button>
  );
};

export default AvailabilityChecker;
