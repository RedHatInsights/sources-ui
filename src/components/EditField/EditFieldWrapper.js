import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import RendererContext from '@data-driven-forms/react-form-renderer/dist/cjs/renderer-context';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import sourceEditContext from '../SourceEditForm/sourceEditContext';
import EditField from './EditField';

export const NOT_CHANGING_COMPONENTS = [componentTypes.CHECKBOX, componentTypes.SWITCH];

const EditFieldWrapper = ({ originalComponent, isEditable = true, ...props }) => {
    let Component = EditField;
    let clearProps = {};

    const { componentMapper } = useContext(RendererContext);
    const { editing } = useContext(sourceEditContext);

    if (editing[props.name] || NOT_CHANGING_COMPONENTS.includes(originalComponent)) {
        Component = componentMapper[originalComponent];
    } else if (isEditable) {
        clearProps = { isEditable: true };
    }

    return <Component {...props} {...clearProps}/>;
};

EditFieldWrapper.propTypes = {
    originalComponent: PropTypes.string,
    name: PropTypes.string,
    isEditable: PropTypes.bool
};

export default EditFieldWrapper;
