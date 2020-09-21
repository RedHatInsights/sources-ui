import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import { asyncValidatorDebounced } from '@redhat-cloud-services/frontend-components-sources/cjs/SourceAddSchema';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import validated from '@redhat-cloud-services/frontend-components-sources/cjs/validated';

import AdditionalInfoBar from './AdditionalInfoBar';
import EditAlert from './EditAlert';

export const genericInfo = (sourceId, intl, sourceType, applications) => ([
    {
        name: 'alert',
        component: 'description',
        Content: EditAlert,
        condition: {
            when: 'message',
            isNotEmpty: true
        }
    },
    {
        name: 'source.name',
        label: intl.formatMessage({
            id: 'sources.sourceName',
            defaultMessage: 'Source name'
        }),
        component: componentTypes.TEXT_FIELD,
        validate: [
            (value) => asyncValidatorDebounced(value, sourceId, intl),
            { type: validatorTypes.REQUIRED }
        ],
        isRequired: true,
        resolveProps: validated
    }, {
        name: 'additional_info',
        Content: AdditionalInfoBar,
        component: 'description',
        sourceType,
        applications
    }
]);
