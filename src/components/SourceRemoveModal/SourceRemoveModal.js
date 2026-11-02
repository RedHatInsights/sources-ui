import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';

import { Button, Checkbox, Content, ContentVariants, Icon, Title } from '@patternfly/react-core';
import { Modal } from '@patternfly/react-core/deprecated';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';

import { removeSource } from '../../redux/sources/actions';
import { useSource } from '../../hooks/useSource';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { routes } from '../../routes';

import { bodyVariants, typesWithExtendedText } from './helpers';
import AppListInRemoval from './AppListInRemoval';

const messages = defineMessages({
  deleteCheckboxTitle: {
    id: 'sources.deleteCheckboxTitle',
    defaultMessage: 'I acknowledge that this action cannot be undone.',
  },

  sourcesDeleteconfirm: {
    id: 'sources.deleteConfirm',
    defaultMessage: 'Remove integration and its data',
  },
  sourcesDeletecancel: {
    id: 'sources.deleteCancel',
    defaultMessage: 'Cancel',
  },
  sourcesDeletetitle: {
    id: 'sources.deleteTitle',
    defaultMessage: 'Remove integration?',
  },
});

const SourceRemoveModal = ({ backPath = '/' }) => {
  const appNavigate = useAppNavigate();

  const [acknowledge, setAcknowledge] = useState(false);

  const intl = useIntl();
  const source = useSource();

  const dispatch = useDispatch();

  const { sourceTypes } = useSelector(({ sources }) => sources, shallowEqual);

  const returnToSources = () => appNavigate(backPath);

  const onSubmit = () => {
    appNavigate(routes.sources.path);
    dispatch(
      removeSource(
        source.id,
        intl.formatMessage(
          {
            id: 'sources.notificationDeleteMessage',
            defaultMessage: `{title} was deleted successfully.`,
          },
          { title: source.name },
        ),
      ),
    );
  };

  const actions = [
    <Button id="deleteSubmit" key="submit" variant="danger" type="button" onClick={onSubmit} isDisabled={!acknowledge}>
      {intl.formatMessage(messages.sourcesDeleteconfirm)}
    </Button>,
    <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={returnToSources}>
      {intl.formatMessage(messages.sourcesDeletecancel)}
    </Button>,
  ];

  const sourceType = sourceTypes.find(({ id }) => id === source.source_type_id)?.name;

  const filteredApps = source.applications.filter(({ isDeleting }) => !isDeleting);

  const body = (
    <Content>
      <Content component={ContentVariants.p}>
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
      </Content>
      {filteredApps.length > 0 && <AppListInRemoval applications={filteredApps} />}
      <Checkbox
        label={intl.formatMessage(messages.deleteCheckboxTitle)}
        onChange={() => setAcknowledge((value) => !value)}
        aria-label={intl.formatMessage(messages.deleteCheckboxTitle)}
        id="acknowledgeDelete"
        name="acknowledgeDelete"
        isChecked={acknowledge}
      />
    </Content>
  );

  return (
    <Modal
      className="sources"
      aria-label={intl.formatMessage(messages.sourcesDeletetitle)}
      header={
        <Title headingLevel="h1" size="2xl" className="sources">
          <Icon size="xl" status="warning">
            <ExclamationTriangleIcon className="ins-m-alert pf-v6-u-mr-sm" />
          </Icon>
          {intl.formatMessage(messages.sourcesDeletetitle)}
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

export default SourceRemoveModal;
