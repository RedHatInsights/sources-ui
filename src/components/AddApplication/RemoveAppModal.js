import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Modal } from '@patternfly/react-core/dist/js/components/Modal/Modal';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

import { useSource } from '../../hooks/useSource';

import removeAppSubmit from './removeAppSubmit';

const RemoveAppModal = ({ app, onCancel, container }) => {
  const intl = useIntl();

  const appTypes = useSelector(({ sources }) => sources.appTypes);
  const source = useSource();

  const dispatch = useDispatch();

  const onSubmit = () => removeAppSubmit(app, intl, onCancel, dispatch, source);

  useEffect(() => {
    if (container) {
      container.hidden = true;
    }
  }, []);

  const dependentApps = app.dependent_applications
    .map((appName) => {
      const appType = appTypes.find(({ name }) => name === appName);

      return app.sourceAppsNames.includes(appType?.display_name) && appType?.display_name;
    })
    .filter((x) => x);

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

RemoveAppModal.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.string.isRequired,
    display_name: PropTypes.string.isRequired,
    dependent_applications: PropTypes.arrayOf(PropTypes.string),
    sourceAppsNames: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  container: PropTypes.instanceOf(Element),
};

export default RemoveAppModal;
