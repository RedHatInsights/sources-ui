import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Modal } from '@patternfly/react-core/dist/js/components/Modal/Modal';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

import { useSource } from '../../hooks/useSource';

import removeAppSubmit from './removeAppSubmit';
import { replaceRouteId, routes } from '../../Routes';

const RemoveAppModal = () => {
  const intl = useIntl();
  const { push } = useHistory();
  const { app_id } = useParams();
  const source = useSource();

  const appTypes = useSelector(({ sources }) => sources.appTypes);
  const dispatch = useDispatch();

  const application = source.applications?.find(({ id }) => id === app_id);

  if (!application) {
    return <Redirect to={replaceRouteId(routes.sourcesDetail.path, source.id)} />;
  }

  const appType = appTypes.find(({ id }) => id === application?.application_type_id);

  const app = {
    id: app_id,
    display_name: appType?.display_name,
    dependent_applications: appType?.dependent_applications,
    sourceAppsNames: source.applications.map(
      ({ application_type_id }) => appTypes.find(({ id }) => id === application_type_id)?.display_name
    ),
  };

  const onCancel = () => push(replaceRouteId(routes.sourcesDetail.path, source.id));
  const onSubmit = () => removeAppSubmit(app, intl, onCancel, dispatch, source);

  const dependentApps = appType?.dependent_applications
    .map((appName) => {
      const appType = appTypes.find(({ name }) => name === appName);

      return source?.applications?.find(({ application_type_id }) => application_type_id === appType.id) && appType?.display_name;
    })
    .filter(Boolean);

  return (
    <Modal
      className="ins-c-sources__dialog--warning"
      isOpen={true}
      onClose={onCancel}
      variant="small"
      aria-label={intl.formatMessage({
        id: 'sources.deleteAppTitle',
        defaultMessage: 'Remove application?',
      })}
      header={
        <Title headingLevel="h1" size="2xl">
          <ExclamationTriangleIcon size="sm" className="ins-m-alert ins-c-source__delete-icon pf-u-mr-sm" />
          {intl.formatMessage({
            id: 'sources.deleteAppTitle',
            defaultMessage: 'Remove application?',
          })}
        </Title>
      }
      actions={[
        <Button id="deleteSubmit" key="submit" variant="danger" type="button" onClick={onSubmit}>
          {intl.formatMessage({
            id: 'sources.remove',
            defaultMessage: 'Remove',
          })}
        </Button>,
        <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={onCancel}>
          {intl.formatMessage({
            id: 'sources.cancel',
            defaultMessage: 'Cancel',
          })}
        </Button>,
      ]}
    >
      <TextContent>
        <Text component={TextVariants.p}>
          {intl.formatMessage(
            {
              id: 'sources.deleteAppWarning',
              defaultMessage: '{ appName } will be disconnected from this source.',
            },
            { appName: <b key="b">{app.display_name}</b> }
          )}
        </Text>
        {dependentApps.length > 0 && (
          <Text component={TextVariants.p}>
            {intl.formatMessage(
              {
                id: 'sources.deleteAppDetails',
                defaultMessage: 'This change will affect these applications: { apps }.',
              },
              { apps: dependentApps }
            )}
          </Text>
        )}
      </TextContent>
    </Modal>
  );
};

export default RemoveAppModal;
