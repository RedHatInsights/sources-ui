import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import PencilAltIcon from '@patternfly/react-icons/dist/js/icons/pencil-alt-icon';

import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form/FormGroup';

import sourceEditContext from '../SourceEditForm/sourceEditContext';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

export const EDIT_FIELD_NAME = 'edit-field';

const EditField = ({ isRequired, label, helperText, hideLabel, name, type, isEditable }) => {
    const { getFieldState, getState } = useFormApi();

    const { setState } = useContext(sourceEditContext);

    const { error, touched, value } = getFieldState(name) || { value: get(getState().initialValues, name) };
    const showError = touched && error;

    const isPassword = type === 'password' || name.includes('password');
    const emptyText = isPassword ? 'Click to edit' : 'Click to add';

    return (
        <FormGroup
            isRequired={ isRequired }
            label={ !hideLabel && label }
            fieldId={ name }
            validated={ showError ? 'error' : 'default' }
            helperText={ helperText }
            helperTextInvalid={ error }
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.charCode === 32 && isEditable) {
                    e.preventDefault();
                    setState({ type: 'setEdit', name });
                }
            }}
            {...(isEditable && { onClick: () => setState({ type: 'setEdit', name }) })}
        >
            <div className={`pf-c-form__horizontal-group ins-c-sources__edit-field-group ${isEditable ? 'clickable' : ''}`}>
                <TextContent className={`ins-c-sources__edit-field-group-text-content ${isEditable ? 'clickable' : ''}`}>
                    <span className="ins-c-sources__edit-field-value pf-u-mr-sm">
                        {value ? value : isEditable ? emptyText : ''}
                    </span>
                    {isEditable && <PencilAltIcon />}
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
    isEditable: PropTypes.bool,
    type: PropTypes.string,
    name: PropTypes.string
};

export default EditField;
