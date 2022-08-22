import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Button, Text, TextContent, Wizard } from '@patternfly/react-core';

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
          <TimeoutStep onClose={afterSubmit} returnButtonTitle={returnButtonTitle} secondaryActions={addAnotherSourceButton} />
        );
        break;
      default:
        if (createdSource.source_type_id === sourceTypes.find(({ name }) => name === 'amazon')?.id) {
          step = <AmazonFinishedStep onClose={afterSubmit} />;
        } else {
          step = (
            <FinishedStep
              onClose={afterSubmit}
              successfulMessage={successfulMessage}
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
            <Text className="pf-u-mb-md">
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

  return (
    <Wizard
      className="sources"
      isOpen={true}
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
