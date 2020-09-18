import React from 'react';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

import { Alert } from '@patternfly/react-core/dist/js/components/Alert/Alert';

const EditAlert = () => {
    const formOptions = useFormApi();

    const { message } = formOptions.getState().values;

    return (
        <Alert variant={message?.variant} isInline title={message?.title} />
    );
};

export default EditAlert;
