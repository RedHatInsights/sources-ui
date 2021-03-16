import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useIntl } from 'react-intl';

import { Text, TextVariants, TextContent, Button, Modal, Checkbox, Title } from '@patternfly/react-core';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';

import { removeSource } from '../../redux/sources/actions';
import { useSource } from '../../hooks/useSource';
import { routes } from '../../Routes';

import { bodyVariants, typesWithExtendedText } from './helpers';
import AppListInRemoval from './AppListInRemoval';

const SourceRemoveModal = ({ backPath }) => {
  const { push } = useHistory();

  const [acknowledge, setAcknowledge] = useState(false);

  const intl = useIntl();
  const source = useSource();

  const dispatch = useDispatch();

  const { sourceTypes } = useSelector(({ sources }) => sources, shallowEqual);

  const returnToSources = () => push(backPath);

  const onSubmit = () => {
    push(routes.sources.path);
    dispatch(
      removeSource(
        source.id,
        intl.formatMessage(
          {
            id: 'sources.notificationDeleteMessage',
            defaultMessage: `{title} was deleted successfully.`,
          },
          { title: source.name }
        )
      )
    );
  };

  const actions = [
    <Button id="deleteSubmit" key="submit" variant="danger" type="button" onClick={onSubmit} isDisabled={!acknowledge}>
      {intl.formatMessage({
        id: 'sources.deleteConfirm',
        defaultMessage: 'Remove source and its data',
      })}
    </Button>,
    <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={returnToSources}>
      {intl.formatMessage({
        id: 'sources.deleteCancel',
        defaultMessage: 'Cancel',
      })}
    </Button>,
  ];

  const sourceType = sourceTypes.find(({ id }) => id === source.source_type_id)?.name;

  const filteredApps = source.applications.filter(({ isDeleting }) => !isDeleting);

  const body = (
    <TextContent>
      <Text component={TextVariants.p}>
        {filteredApps.length === 0 && bodyVariants('noApps', { name: source.name })}
        {filteredApps.length > 0 &&
          typesWithExtendedText.includes(sourceType) &&
          bodyVariants('withApps', {
            name: source.name,
            count: filteredApps.length,
          })}
        {filteredApps.length > 0 &&
          !typesWithExtendedText.includes(sourceType) &&
          bodyVariants('withAppsExtendedText', {
            name: source.name,
            count: filteredApps.length,
          })}
      </Text>
      {filteredApps.length > 0 && <AppListInRemoval applications={filteredApps} />}
      <Checkbox
        label={intl.formatMessage({
          id: 'sources.deleteCheckboxTitle',
          defaultMessage: `I acknowledge that this action cannot be undone.`,
        })}
        onChange={() => setAcknowledge((value) => !value)}
        aria-label={intl.formatMessage({
          id: 'sources.deleteCheckboxTitle',
          defaultMessage: `I acknowledge that this action cannot be undone.`,
        })}
        id="acknowledgeDelete"
        name="acknowledgeDelete"
        isChecked={acknowledge}
      />
    </TextContent>
  );

  return (
    <Modal
      className="sources"
      aria-label={intl.formatMessage({
        id: 'sources.deleteTitle',
        defaultMessage: `Remove source?`,
      })}
      header={
        <Title headingLevel="h1" size="2xl" className="sources">
          <ExclamationTriangleIcon size="sm" className="ins-m-alert ins-c-source__delete-icon pf-u-mr-sm" />
          {intl.formatMessage({
            id: 'sources.deleteTitle',
            defaultMessage: `Remove source?`,
          })}
        </Title>
      }
      isOpen
      variant="small"
      onClose={returnToSources}
      actions={actions}
    >
      {body}
    </Modal>
  );
};

SourceRemoveModal.propTypes = {
  backPath: PropTypes.string,
};

SourceRemoveModal.defaultProps = {
  backPath: routes.sources.path,
};

export default SourceRemoveModal;
