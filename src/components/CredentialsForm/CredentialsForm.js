import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Modal } from '@patternfly/react-core/dist/esm/components/Modal';
import { Spinner } from '@patternfly/react-core/dist/esm/components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/esm/layouts/Bullseye';

import generateSuperKeyFields from '@redhat-cloud-services/frontend-components-sources/esm/generateSuperKeyFields';

import { useSource } from '../../hooks/useSource';

import { replaceRouteId, routes } from '../../Routes';

import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import ModalFormTemplate from './ModalFormTemplate';
import { getSourcesApi } from '../../api/entities';
import { addMessage } from '../../redux/sources/actions';

const initialState = {
  loading: true,
  initialValues: {},
};

const reducer = (state, { type, values }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        loading: false,
        initialValues: {
          authentication: values,
        },
      };
  }
};

const CredentialsForm = () => {
  const source = useSource();
  const history = useHistory();
  const intl = useIntl();
  const reduxDispatch = useDispatch();
  const { sourceTypes } = useSelector(({ sources }) => sources, shallowEqual);
  const sourceTypeName = sourceTypes.find(({ id }) => id === source.source_type_id).name;

  const [{ loading, initialValues }, dispatch] = useReducer(reducer, initialState);

  const goBackToDetail = () => history.push(replaceRouteId(routes.sourcesDetail.path, source.id));

  const title = intl.formatMessage({ id: 'editCredentials.title', defaultMessage: 'Edit account authorization credentials' });
  const description = intl.formatMessage({
    id: 'editCredentials.description',
    defaultMessage:
      'Use the fields below to reset your account authorization credentials. It may take some time to validate new information.',
  });

  useEffect(() => {
    getSourcesApi()
      .listSourceAuthentications(source.id)
      .then(({ data }) => {
        const authhype = sourceTypes
          .find(({ name }) => name === sourceTypeName)
          ?.schema.authentication.find(({ is_super_key, type }) => is_super_key || type === 'access_key_secret_key');

        const values = data.find(({ authtype }) => authtype === authhype.type);

        dispatch({ type: 'loaded', values });
      });
  }, []);

  if (loading) {
    return (
      <Modal title={title} variant="small" isOpen onClose={goBackToDetail}>
        <Bullseye className="pf-u-m-2xl">
          <Spinner />
        </Bullseye>
      </Modal>
    );
  }

  return (
    <SourcesFormRenderer
      clearedValue={null}
      schema={{
        fields: [generateSuperKeyFields(sourceTypes, sourceTypeName)],
      }}
      // eslint-disable-next-line no-unused-vars
      onSubmit={async ({ authentication: { tenant, source_id, id, authtype, resource_id, ...values } }) => {
        goBackToDetail();

        try {
          await getSourcesApi().updateAuthentication(id, values);

          reduxDispatch(
            addMessage({
              title: intl.formatMessage({ id: 'editCredentials.alert.title', defaultMessage: 'New credentials saved' }),
              description: intl.formatMessage({
                id: 'editCredentials.alert.description',
                defaultMessage: 'It may take some time to validate your new credentials. Check this page for status updates.',
              }),
              variant: 'info',
            })
          );
        } catch (error) {
          reduxDispatch(
            addMessage({
              title: intl.formatMessage({
                id: 'editCredentials.alert.warning.title',
                defaultMessage: 'Error updating credentials',
              }),
              description: intl.formatMessage({
                id: 'editCredentials.alert.warning.description',
                defaultMessage:
                  'There was a problem while trying to update credentials. Please try again. If the error persists, open a support case.',
              }),
              variant: 'danger',
            })
          );
        }
      }}
      initialValues={initialValues}
      FormTemplate={(props) => (
        <ModalFormTemplate
          {...props}
          ModalProps={{
            isOpen: true,
            onClose: goBackToDetail,
            variant: 'small',
            title,
            description,
          }}
        />
      )}
      onCancel={goBackToDetail}
    />
  );
};

export default CredentialsForm;
