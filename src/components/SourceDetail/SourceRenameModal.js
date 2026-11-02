import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { Modal } from '@patternfly/react-core/deprecated';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import { useSource } from '../../hooks/useSource';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import { replaceRouteId, routes } from '../../routes';
import { renameSource } from '../../redux/sources/actions';
import { asyncValidatorDebounced } from '../../components/addSourceWizard/SourceAddSchema';
import validated from '../../utilities/resolveProps/validated';
import { useAppNavigate } from '../../hooks/useAppNavigate';

const messages = defineMessages({
  sourcesRenametitle: {
    id: 'sources.renameTitle',
    defaultMessage: 'Rename integration',
  },
  sourcesRenamedescription: {
    id: 'sources.renameDescription',
    defaultMessage: 'Enter a new name for your source.',
  },
  sourcesSave: {
    id: 'sources.save',
    defaultMessage: 'Save',
  },
  sourcesRenameerror: {
    id: 'sources.renameError',
    defaultMessage: 'Renaming was unsuccessful',
  },
  sourcesName: {
    id: 'sources.name',
    defaultMessage: 'Name',
  },
});

const SourceRenameModal = () => {
  const source = useSource();
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useAppNavigate();

  const returnToSource = () => navigate(replaceRouteId(routes.sourcesDetail.path, source.id));

  return (
    <Modal
      title={intl.formatMessage(messages.sourcesRenametitle)}
      description={intl.formatMessage(messages.sourcesRenamedescription)}
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
            submitLabel={intl.formatMessage(messages.sourcesSave)}
          />
        )}
        onSubmit={({ name }) => {
          returnToSource();

          return dispatch(renameSource(source.id, name, intl.formatMessage(messages.sourcesRenameerror)));
        }}
        onCancel={returnToSource}
        schema={{
          fields: [
            {
              name: 'name',
              label: intl.formatMessage(messages.sourcesName),
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
