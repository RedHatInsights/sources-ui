import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import {
	Button,
	Content,
	ContentVariants,
	Icon,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Title
} from '@patternfly/react-core';
import {
	Modal
} from '@patternfly/react-core/deprecated';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

import { useSource } from '../../hooks/useSource';

import removeAppSubmit from './removeAppSubmit';
import { replaceRouteId, routes } from '../../routes';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import AppNavigate from '../AppNavigate';

const RemoveAppModal = () => {
  const intl = useIntl();
  const navigate = useAppNavigate();
  const { app_id } = useParams();
  const source = useSource();

  const appTypes = useSelector(({ sources }) => sources.appTypes);
  const dispatch = useDispatch();

  const application = source.applications?.find(({ id }) => id === app_id);

  if (!application) {
    return <AppNavigate to={replaceRouteId('/' + routes.sourcesDetail.path, source.id)} />;
  }

  const appType = appTypes.find(({ id }) => id === application?.application_type_id);

  const app = {
    id: app_id,
    display_name: appType?.display_name,
    dependent_applications: appType?.dependent_applications,
    sourceAppsNames: source.applications.map(
      ({ application_type_id }) => appTypes.find(({ id }) => id === application_type_id)?.display_name,
    ),
  };

  const onCancel = () => navigate(replaceRouteId(routes.sourcesDetail.path, source.id));
  const onSubmit = () => removeAppSubmit(app, intl, onCancel, dispatch, source);

  const dependentApps = appType?.dependent_applications
    .map((appName) => {
      const appType = appTypes.find(({ name }) => name === appName);

      return source?.applications?.find(({ application_type_id }) => application_type_id === appType.id) && appType?.display_name;
    })
    .filter(Boolean);

  return (
    <Modal
      className="sources"
      isOpen={true}
      onClose={onCancel}
      variant="small"
      aria-label={intl.formatMessage({
        id: 'sources.deleteAppTitle',
        defaultMessage: 'Remove application?',
      })}
    >
      <ModalHeader>
        <Title headingLevel="h1" size="2xl" className="sources">
          <Icon size="xl" status="warning">
            <ExclamationTriangleIcon className="ins-m-alert pf-v6-u-mr-sm" />
          </Icon>
          {intl.formatMessage({
            id: 'sources.deleteAppTitle',
            defaultMessage: 'Remove application?',
          })}
        </Title>
      </ModalHeader>
      <ModalBody>
        <Content>
          <Content component={ContentVariants.p}>
            {intl.formatMessage(
              {
                id: 'sources.deleteAppWarning',
                defaultMessage: '{ appName } will be disconnected from this integration.',
              },
              { appName: <b key="b">{app.display_name}</b> },
            )}
          </Content>
          {dependentApps.length > 0 && (
            <Content component={ContentVariants.p}>
              {intl.formatMessage(
                {
                  id: 'sources.deleteAppDetails',
                  defaultMessage: 'This change will affect these applications: { apps }.',
                },
                { apps: dependentApps },
              )}
            </Content>
          )}
        </Content>
      </ModalBody>
      <ModalFooter>
        <Button id="deleteSubmit" key="submit" variant="danger" type="button" onClick={onSubmit}>
          {intl.formatMessage({
            id: 'sources.remove',
            defaultMessage: 'Remove',
          })}
        </Button>
        <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={onCancel}>
          {intl.formatMessage({
            id: 'sources.cancel',
            defaultMessage: 'Cancel',
          })}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RemoveAppModal;
