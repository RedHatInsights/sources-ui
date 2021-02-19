import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Modal } from '@patternfly/react-core/dist/esm/components/Modal/Modal';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import { asyncValidatorDebounced } from '@redhat-cloud-services/frontend-components-sources/esm/SourceAddSchema';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/esm/validator-types';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import validated from '@redhat-cloud-services/frontend-components-sources/esm/validated';

import { useSource } from '../../hooks/useSource';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import { replaceRouteId, routes } from '../../Routes';
import { renameSource } from '../../redux/sources/actions';

const SourceRenameModal = () => {
  const source = useSource();
  const intl = useIntl();
  const dispatch = useDispatch();
  const { push } = useHistory();

  const returnToSource = () => push(replaceRouteId(routes.sourcesDetail.path, source.id));

  return (
    <Modal
      title={intl.formatMessage({ id: 'sources.renameTitle', defaultMessage: 'Rename source' })}
      description={intl.formatMessage({ id: 'sources.renameDescription', defaultMessage: 'Enter a new name for your source.' })}
      onClose={returnToSource}
      isOpen
      variant="medium"
      className="sources"
    >
      <SourcesFormRenderer
        FormTemplate={(props) => (
          <FormTemplate
            {...props}
            disableSubmit={['pristine', 'validating', 'invalid']}
            submitLabel={intl.formatMessage({ id: 'sources.save', defaultMessage: 'Save' })}
          />
        )}
        onSubmit={({ name }) => {
          returnToSource();

          return dispatch(
            renameSource(
              source.id,
              name,
              intl.formatMessage({ id: 'sources.renameError', defaultMessage: 'Renaming was unsuccessful' })
            )
          );
        }}
        onCancel={returnToSource}
        schema={{
          fields: [
            {
              name: 'name',
              label: intl.formatMessage({
                id: 'sources.name',
                defaultMessage: 'Name',
              }),
              component: componentTypes.TEXT_FIELD,
              validate: [(value) => asyncValidatorDebounced(value, source.id, intl), { type: validatorTypes.REQUIRED }],
              isRequired: true,
              resolveProps: validated,
              initialValue: source.name,
            },
          ],
        }}
      />
    </Modal>
  );
};

export default SourceRenameModal;
