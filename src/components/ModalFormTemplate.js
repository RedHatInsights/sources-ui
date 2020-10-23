import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import FormSpy from '@data-driven-forms/react-form-renderer/dist/cjs/form-spy';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

import { Modal } from '@patternfly/react-core/dist/js/components/Modal';
import { ActionGroup } from '@patternfly/react-core/dist/js/components/Form/ActionGroup';
import { Button } from '@patternfly/react-core/dist/js/components/Button';
import { Form } from '@patternfly/react-core/dist/js/components/Form/Form';

const CustomFormWrapper = (props) => <Form {...props} id="modal-form" />;

const CustomButtons = () => {
  const intl = useIntl();
  const { onReset, onCancel } = useFormApi();

  return (
    <FormSpy
      subscription={{
        submitting: true,
        pristine: true,
        invalid: true,
        validating: true,
      }}
    >
      {({ pristine, invalid, validating, submitting }) => (
        <div className="pf-c-form">
          <ActionGroup className="pf-u-mt-0">
            <Button
              variant="primary"
              form="modal-form"
              type="submit"
              isDisabled={pristine || validating || submitting || invalid}
            >
              {intl.formatMessage({
                id: 'sources.save',
                defaultMessage: 'Save',
              })}
            </Button>
            <Button variant="secondary" isDisabled={pristine} onClick={onReset} id="reset-modal">
              {intl.formatMessage({
                id: 'sources.reset',
                defaultMessage: 'Reset',
              })}
            </Button>
            <Button variant="link" onClick={onCancel} id="cancel-modal">
              {intl.formatMessage({
                id: 'sources.cancel',
                defaultMessage: 'Cancel',
              })}
            </Button>
          </ActionGroup>
        </div>
      )}
    </FormSpy>
  );
};

const ModalFormTemplate = ({ ModalProps, ...props }) => (
  <Modal {...ModalProps} footer={<CustomButtons />}>
    <FormTemplate {...props} showFormControls={false} FormWrapper={CustomFormWrapper} />
  </Modal>
);

ModalFormTemplate.propTypes = {
  ModalProps: PropTypes.object,
};

export default ModalFormTemplate;
