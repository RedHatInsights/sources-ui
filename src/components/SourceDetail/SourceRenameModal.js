import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { Modal } from '@patternfly/react-core';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import { useSource } from '../../hooks/useSource';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import { replaceRouteId, routes } from '../../Routing';
import { renameSource } from '../../redux/sources/actions';
import { asyncValidatorDebounced } from '../../components/addSourceWizard/SourceAddSchema';
import validated from '../../utilities/resolveProps/validated';
import { useAppNavigate } from '../../hooks/useAppNavigate';

const SourceRenameModal = () => {
  const source = useSource();
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useAppNavigate();

  const returnToSource = () => navigate(replaceRouteId(routes.sourcesDetail.path, source.id));

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
              intl.formatMessage({ id: 'sources.renameError', defaultMessage: 'Renaming was unsuccessful' }),
            ),
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
