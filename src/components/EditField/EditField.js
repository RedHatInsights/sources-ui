import React from 'react';
import PropTypes from 'prop-types';
import PencilAltIcon from '@patternfly/react-icons/dist/js/icons/pencil-alt-icon';

import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form/FormGroup';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';

export const EDIT_FIELD_NAME = 'edit-field';

const EditField = (props) => {
    const { isRequired, label, helperText, hideLabel, meta, input, type, setEdit } = useFieldApi(props);

    const { error, touched } = meta;
    const showError = touched && error;

    let value = input.value;

    if (typeof value === 'boolean') {
        value = value ? 'True' : 'False';
    }

    const isPassword = type === 'password' || input.name.includes('password');
    const emptyText = isPassword ? 'Click to edit' : 'Click to add';

    return (
        <FormGroup
            isRequired={ isRequired }
            label={ !hideLabel && label }
            fieldId={ input.name }
            isValid={ !showError }
            helperText={ helperText }
            helperTextInvalid={ error }
            onClick={setEdit ? () => setEdit(input.name) : undefined}
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.charCode === 32 && setEdit) {
                    e.preventDefault();
                    setEdit(input.name);
                }
            }}
        >
            <div className={`pf-c-form__horizontal-group ins-c-sources__edit-field-group ${setEdit ? 'clickable' : ''}`}>
                <TextContent className={`ins-c-sources__edit-field-group-text-content ${setEdit ? 'clickable' : ''}`}>
                    <span className="ins-c-sources__edit-field-value pf-u-mr-sm">
                        {value ? value : setEdit ? emptyText : ''}
                    </span>
                    {setEdit && <PencilAltIcon />}
                </TextContent>
            </div>
        </FormGroup>
    );
};

EditField.propTypes = {
    label: PropTypes.node,
    isRequired: PropTypes.bool,
    helperText: PropTypes.node,
    hideLabel: PropTypes.bool,
    setEdit: PropTypes.func,
    type: PropTypes.string
};

export default EditField;
