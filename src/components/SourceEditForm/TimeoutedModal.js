import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Title } from '@patternfly/react-core/dist/js/components/Title';
import { Button } from '@patternfly/react-core/dist/js/components/Button';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye';
import { EmptyState, EmptyStateVariant, EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import WrenchIcon from '@patternfly/react-icons/dist/js/icons/wrench-icon';

const TimeoutedModal = ({ setState }) => {
  const intl = useIntl();

  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full} className="pf-u-mt-4xl">
        <EmptyStateIcon icon={WrenchIcon} color="var(--pf-global--Color--200)" className="pf-u-mb-0" />
        <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
          {intl.formatMessage({
            id: 'sources.editTimetoutedTitle',
            defaultMessage: 'Edit source not yet complete',
          })}
        </Title>
        <EmptyStateBody>
          {intl.formatMessage(
            {
              id: 'sources.editTimetoutedDescription',
              defaultMessage:
                'We are still working to confirm your updated credentials and app settings.{newLine}To track progress, check the Status column in the Sources table.',
            },
            { newLine: <br key="br" /> }
          )}
        </EmptyStateBody>
        <Button variant="primary" onClick={() => setState({ type: 'cancelTimetouted' })} className="pf-u-mt-xl">
          {intl.formatMessage({
            id: 'sources.edit',
            defaultMessage: 'Edit',
          })}
        </Button>
      </EmptyState>
    </Bullseye>
  );
};

TimeoutedModal.propTypes = {
  setState: PropTypes.func.isRequired,
};

export default TimeoutedModal;
