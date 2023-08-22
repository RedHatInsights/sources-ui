import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button, Modal, Text, TextContent, Wizard } from '@patternfly/react-core';

import { wizardDescription, wizardTitle } from './stringConstants';
import { getSourcesApi } from '../../api/entities';
import computeSourceStatus from '../../utilities/computeSourceStatus';
import EditLink from './EditLink';
import computeSourceError from '../../utilities/computeSourceError';

import FinishedStep from '../steps/FinishedStep';
import LoadingStep from '../steps/LoadingStep';
import ErroredStep from '../steps/ErroredStep';
import TimeoutStep from '../steps/TimeoutStep';
import AmazonFinishedStep from '../steps/AmazonFinishedStep';
import { COST_MANAGEMENT_APP_ID, HCS_APP_NAME } from '../../utilities/constants';

const FinalWizard = ({
  afterSubmit,
  afterError,
  isFinished,
  isErrored,
  successfulMessage,
  hideSourcesButton,
  returnButtonTitle,
  reset,
  createdSource = {},
  tryAgain,
  afterSuccess,
  sourceTypes,
  activeCategory,
}) => {
  const [isDeletingSource, setIsDeleting] = useState();
  const [isAfterDeletion, setDeleted] = useState();
  const isStorageOnly = createdSource.applications?.some((app) => app?.extra?.storage_only);
  const isCostManagement = createdSource.applications?.some((app) => app?.application_type_id === COST_MANAGEMENT_APP_ID);
  const isHcs = createdSource.applications?.some((app) => app?.extra?.hcs);

  const intl = useIntl();

  const removeSource = () => {
    setIsDeleting(true);

    return getSourcesApi()
      .deleteSource(createdSource.id)
      .then(() => {
        afterSuccess && afterSuccess();
        setDeleted(true);
      })
      .catch(() => setIsDeleting(false));
  };

  const addAnotherSourceButton = (
    <Button variant="link" onClick={reset}>
      {intl.formatMessage({
        id: 'wizard.addAnotherSource',
        defaultMessage: 'Add another source',
      })}
    </Button>
  );

  let step;
  if (isAfterDeletion) {
    step = (
      <FinishedStep
        onClose={afterSubmit}
        title={intl.formatMessage({ id: 'wizard.removeSourceSuccessTitle', defaultMessage: 'Removing successful' })}
        successfulMessage={intl.formatMessage({
          id: 'wizard.removeSourceSuccessDescription',
          defaultMessage: 'Source was successfully removed.',
        })}
        hideSourcesButton={hideSourcesButton}
        returnButtonTitle={returnButtonTitle}
        secondaryActions={addAnotherSourceButton}
      />
    );
  } else if (isDeletingSource) {
    step = (
      <LoadingStep
        customText={intl.formatMessage({
          id: 'wizard.removingSource',
          defaultMessage: 'Removing source',
        })}
      />
    );
  } else if (isFinished) {
    switch (computeSourceStatus(createdSource)) {
      case 'unavailable':
        step = (
          <ErroredStep
            onClose={afterSubmit}
            secondaryActions={
              <Button variant="link" onClick={removeSource}>
                {intl.formatMessage({ id: 'wizard.removeSource', defaultMessage: 'Remove source' })}
              </Button>
            }
            Component={() => <EditLink id={createdSource.id} />}
            message={computeSourceError(createdSource, intl)}
            title={intl.formatMessage({ id: 'wizard.configurationUnsuccessful', defaultMessage: 'Configuration unsuccessful' })}
          />
        );
        break;
      case 'timeout':
        step = (
          <TimeoutStep
            onClose={afterSubmit}
            returnButtonTitle={returnButtonTitle}
            secondaryActions={addAnotherSourceButton}
            {...(isCostManagement &&
              isStorageOnly && {
                uuid: createdSource?.uid,
              })}
          />
        );
        break;
      default:
        if (createdSource.source_type_id === sourceTypes.find(({ name }) => name === 'amazon')?.id) {
          step = <AmazonFinishedStep onClose={afterSubmit} />;
        } else {
          step = (
            <FinishedStep
              onClose={afterSubmit}
              successfulMessage={
                isCostManagement && isStorageOnly
                  ? `You have chosen to manually customize the cost data set sent to ${
                      isHcs ? HCS_APP_NAME : 'Cost Management'
                    }, you will still need to perform additional steps to complete the process.`
                  : successfulMessage
              }
              {...(isCostManagement &&
                isStorageOnly && {
                  title: <FormattedMessage id="wizard.waitTheresMore" defaultMessage="Success, but wait there's more!" />,
                  uuid: createdSource?.uid,
                })}
              hideSourcesButton={hideSourcesButton}
              returnButtonTitle={returnButtonTitle}
              secondaryActions={addAnotherSourceButton}
            />
          );
        }

        break;
    }
  } else if (isErrored) {
    step = (
      <ErroredStep
        onClose={afterError}
        primaryAction={tryAgain}
        secondaryActions={
          <Text
            component="a"
            target="_blank"
            href="https://access.redhat.com/support/cases/#/case/new/open-case?caseCreate=true"
            rel="noopener noreferrer"
          >
            {intl.formatMessage({ id: 'wizard.openTicket', defaultMessage: 'Open a support case' })}
          </Text>
        }
        returnButtonTitle={intl.formatMessage({
          id: 'wizard.retryText',
          defaultMessage: 'Retry',
        })}
      />
    );
  } else {
    step = (
      <LoadingStep
        customText={intl.formatMessage({
          id: 'wizard.loadingText',
          defaultMessage: 'Validating credentials',
        })}
        description={
          <TextContent>
            <Text className="pf-v5-u-mb-md">
              {intl.formatMessage({
                id: 'wizard.loadingDescription-a',
                defaultMessage:
                  // eslint-disable-next-line max-len
                  "This might take some time. You'll receive a notification if you are still in the Sources application when the process completes. Otherwise, you can check the status in the main sources table at any time.",
              })}
            </Text>
            <Text>
              {intl.formatMessage({
                id: 'wizard.loadingDescription-b',
                defaultMessage: 'In the meantime, you can close this window while the validation process continues.',
              })}
            </Text>
          </TextContent>
        }
        onClose={afterError}
        cancelTitle={intl.formatMessage({ id: 'wizard.close', defaultMessage: 'Close' })}
      />
    );
  }

  const appendTo = React.useMemo(() => document.querySelector('.pf-v5-c-page.chr-c-page'), []);

  return (
    <Modal isOpen width="58%" hasNoBodyWrapper appendTo={appendTo} showClose={false}>
      <Wizard
        className="sources"
        onClose={isFinished ? afterSubmit : afterError}
        title={wizardTitle(activeCategory)}
        description={wizardDescription(activeCategory)}
        steps={[
          {
            name: 'Finish',
            component: step,
            isFinishedStep: true,
          },
        ]}
      />
    </Modal>
  );
};

FinalWizard.propTypes = {
  afterSubmit: PropTypes.func.isRequired,
  afterError: PropTypes.func.isRequired,
  isFinished: PropTypes.bool.isRequired,
  isErrored: PropTypes.bool.isRequired,
  successfulMessage: PropTypes.node.isRequired,
  hideSourcesButton: PropTypes.bool,
  returnButtonTitle: PropTypes.node.isRequired,
  errorMessage: PropTypes.node,
  reset: PropTypes.func,
  createdSource: PropTypes.object,
  tryAgain: PropTypes.func,
  afterSuccess: PropTypes.func,
  sourceTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  activeCategory: PropTypes.string,
};

export default FinalWizard;
