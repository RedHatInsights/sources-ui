import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useIntl } from 'react-intl';

import RedoIcon from '@patternfly/react-icons/dist/esm/icons/redo-icon';
import { Button, Spinner } from '@patternfly/react-core';

import { useSource } from '../../hooks/useSource';
import checkSourceStatus from '../../api/checkSourceStatus';
import notificationsStore from '../../utilities/notificationsStore';

const AvailabilityChecker = ({ setCheckPending }) => {
  const source = useSource();
  const intl = useIntl();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      icon={
        <>
          {!loading && <RedoIcon data-testid="RedoIcon" />}
          {loading && <Spinner size="md" />}
        </>
      }
      variant="plain"
      aria-label={intl.formatMessage({ id: 'sources.checkavailability', defaultMessage: 'Check integration availability' })}
      onClick={async () => {
        setCheckPending && setCheckPending();
        setLoading(true);
        await checkSourceStatus(source.id);
        setLoading(false);
        notificationsStore.addNotification({
          title: intl.formatMessage({
            id: 'sources.checkavailability.notificationTitle',
            defaultMessage: 'Request to check integration status was sent',
          }),
          variant: 'info',
          description: intl.formatMessage({
            id: 'sources.checkavailability.notificationDescription',
            defaultMessage: 'Check this page later for updates',
          }),
        });
      }}
      isDisabled={loading}
    />
  );
};

AvailabilityChecker.propTypes = {
  setCheckPending: propTypes.func,
};

export default AvailabilityChecker;
