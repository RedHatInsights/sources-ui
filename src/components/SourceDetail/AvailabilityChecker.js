import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import RedoIcon from '@patternfly/react-icons/dist/esm/icons/redo-icon';
import { Button, Spinner } from '@patternfly/react-core';

import { useSource } from '../../hooks/useSource';
import checkSourceStatus from '../../api/checkSourceStatus';
import { addMessage } from '../../redux/sources/actions';

const AvailabilityChecker = ({ setCheckPending }) => {
  const source = useSource();
  const intl = useIntl();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="plain"
      aria-label={intl.formatMessage({ id: 'sources.checkavailability', defaultMessage: 'Check integration availability' })}
      onClick={async () => {
        setCheckPending && setCheckPending();
        setLoading(true);
        await checkSourceStatus(source.id);
        setLoading(false);
        dispatch(
          addMessage({
            title: intl.formatMessage({
              id: 'sources.checkavailability.notificationTitle',
              defaultMessage: 'Request to check integration status was sent',
            }),
            variant: 'info',
            description: intl.formatMessage({
              id: 'sources.checkavailability.notificationDescription',
              defaultMessage: 'Check this page later for updates',
            }),
          }),
        );
      }}
      isDisabled={loading}
    >
      {!loading && <RedoIcon data-testid="RedoIcon" />}
      {loading && <Spinner size="md" />}
    </Button>
  );
};

AvailabilityChecker.propTypes = {
  setCheckPending: propTypes.func,
};

export default AvailabilityChecker;
