import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Modal } from '@patternfly/react-core/dist/js/components/Modal';
import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import sourceEditContext from '../sourceEditContext';
import { addMessage } from '../../../redux/sources/actions';
import { doDeleteAuthentication } from '../../../api/entities';
import { handleError } from '@redhat-cloud-services/frontend-components-sources/cjs/handleError';

const RemoveAuth = ({ authId }) => {
  const { setState, source, sourceType } = useContext(sourceEditContext);

  const schemaAuth = sourceType?.schema?.authentication?.find(
    ({ type }) => type === source?.authentications?.find((auth) => auth?.id === authId)?.authtype
  );

  const dispatch = useDispatch();
  const intl = useIntl();

  const onClose = () => setState({ type: 'closeAuthRemoving' });

  const onRemove = () => {
    setState({ type: 'removeAuthPending', authId });
    onClose();
    return doDeleteAuthentication(authId)
      .then(() => {
        setState({ type: 'removeAuthFulfill', authId });
        dispatch(
          addMessage(
            intl.formatMessage({
              id: 'sources.authRemoveFullfil',
              defaultMessage: 'Authentication was deleted successfully.',
            }),
            'success'
          )
        );
      })
      .catch((error) => {
        setState({ type: 'removeAuthRejected', authId });
        dispatch(
          addMessage(
            intl.formatMessage({
              id: 'sources.authRemoveRejected',
              defaultMessage: 'Authentication was not deleted successfully.',
            }),
            'danger',
            handleError(error)
          )
        );
      });
  };

  return (
    <Modal
      isOpen
      className="ins-c-sources__dialog--warning"
      onClose={onClose}
      actions={[
        <Button id="deleteSubmit" key="submit" variant="danger" type="button" onClick={onRemove}>
          {intl.formatMessage({
            id: 'sources.deleteConfirm',
            defaultMessage: 'Remove authentication',
          })}
        </Button>,
        <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={onClose}>
          {intl.formatMessage({
            id: 'sources.deleteCancel',
            defaultMessage: 'Cancel',
          })}
        </Button>,
      ]}
      variant="small"
      aria-label={intl.formatMessage({
        id: 'sources.deleteAuthTitle',
        defaultMessage: 'Remove authentication?',
      })}
      header={
        <Title headingLevel="h1" size="2xl">
          <ExclamationTriangleIcon size="sm" className="ins-m-alert ins-c-source__delete-icon pf-u-mr-sm" />
          {intl.formatMessage({
            id: 'sources.deleteAppTitle',
            defaultMessage: 'Remove authentication?',
          })}
        </Title>
      }
    >
      <TextContent>
        <Text variant={TextVariants.p}>
          {intl.formatMessage(
            {
              id: 'sources.removeAuthWarning',
              defaultMessage: 'This action will permanently remove {auth} from this source.',
            },
            { auth: <b key="b">{schemaAuth?.name}</b> }
          )}
        </Text>
      </TextContent>
    </Modal>
  );
};

RemoveAuth.propTypes = {
  authId: PropTypes.string.isRequired,
};

export default RemoveAuth;
