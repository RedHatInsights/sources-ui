import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

import { Modal } from '@patternfly/react-core/dist/esm/components/Modal';
import { ActionGroup } from '@patternfly/react-core/dist/esm/components/Form/ActionGroup';
import { Button } from '@patternfly/react-core/dist/esm/components/Button';
import { Form } from '@patternfly/react-core/dist/esm/components/Form/Form';

const CustomFormWrapper = (props) => <Form {...props} id="modal-form" />;

const CustomButtons = () => {
  const intl = useIntl();
  const { onCancel } = useFormApi();

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
                id: 'sources.submit',
                defaultMessage: 'Submit',
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
