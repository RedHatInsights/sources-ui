import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, TextContent } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';

export const EDIT_FIELD_NAME = 'edit-field';

const EditField = ({ isRequired, label, helperText, hideLabel, meta, input, type, setEdit }) => {
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
        >
            <div className={`pf-c-form__horizontal-group ins-c-sources__edit-field-group ${setEdit ? 'clickable' : ''}`}>
                <TextContent className="ins-c-sources__edit-field-group-text-content">
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
    label: PropTypes.string,
    isRequired: PropTypes.bool,
    helperText: PropTypes.string,
    meta: PropTypes.object.isRequired,
    FieldProvider: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    input: PropTypes.shape({
        value: PropTypes.any,
        name: PropTypes.string.isRequired
    }).isRequired,
    hideLabel: PropTypes.bool,
    setEdit: PropTypes.func,
    type: PropTypes.string
};

const EditFieldProvider = ({ FieldProvider, ...rest }) =>
    (
        <FieldProvider { ...rest }>
            { (props) =>  <EditField  { ...props }/> }
        </FieldProvider>
    );

EditFieldProvider.propTypes = {
    FieldProvider: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
};

export default EditFieldProvider;
