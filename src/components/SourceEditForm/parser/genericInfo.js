import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import { asyncValidatorDebounced } from '@redhat-cloud-services/frontend-components-sources/cjs/SourceAddSchema';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import validated from '@redhat-cloud-services/frontend-components-sources/cjs/validated';

import { EDIT_FIELD_NAME } from '../../EditField/EditField';

export const genericInfo = (sourceId, intl) => ([
    {
        name: 'source.name',
        label: intl.formatMessage({
            id: 'sources.sourceName',
            defaultMessage: 'Source name'
        }),
        originalComponent: componentTypes.TEXT_FIELD,
        component: EDIT_FIELD_NAME,
        validate: [
            (value) => asyncValidatorDebounced(value, sourceId, intl),
            { type: validatorTypes.REQUIRED }
        ],
        isRequired: true,
        resolveProps: validated
    }, {
        name: 'source_type',
        label: intl.formatMessage({
            id: 'sources.sourceType',
            defaultMessage: 'Source type'
        }),
        isReadOnly: true,
        component: EDIT_FIELD_NAME,
        isEditable: false
    }
]);
