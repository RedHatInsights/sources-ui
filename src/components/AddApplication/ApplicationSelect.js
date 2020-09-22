import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { Radio } from '@patternfly/react-core/dist/js/components/Radio/Radio';
import { Button } from '@patternfly/react-core/dist/js/components/Button';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';

import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';

import { useSource } from '../../hooks/useSource';

import RemoveAppModal from './RemoveAppModal';

const RemoveRadio = ({ option, setApplicationToRemove, sourceAppsNames }) => {
    const appTypes = useSelector(({ sources }) => sources.appTypes);
    const source = useSource();

    const appType = appTypes?.find(appType =>
        appType.id === option.value
    );
    const app = source.applications.find(app => app.application_type_id === option.value);

    const onClick = () => setApplicationToRemove({
        id: app?.id,
        display_name: appType?.display_name,
        dependent_applications: appType?.dependent_applications,
        sourceAppsNames
    });

    return (<div className="pf-c-radio">
        <Button variant="plain" aria-label="Remove app" className="pf-u-p-0" onClick={onClick}>
            <TrashIcon variant="small" />
        </Button>
        <label className="pf-c-radio__label">
            {option.label}
        </label>
    </div>);
};

RemoveRadio.propTypes = {
    option: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }),
    setApplicationToRemove: PropTypes.func.isRequired,
    sourceAppsNames: PropTypes.arrayOf(PropTypes.string)
};

const ApplicationSelect = (props) => {
    const { options, appIds, input: { onChange, value, name }, container } = useFieldApi(props);

    const [removingApp, setApplicationToRemove] = useState({});

    const appTypes = useSelector(({ sources }) => sources.appTypes);
    const source = useSource();

    const sourceAppsNames = source.applications
    .map(({ application_type_id }) => {
        const appType = appTypes.find(({ id }) => id === application_type_id);
        return appType ? appType.display_name : undefined;
    });

    return (
        <div>
            {removingApp.id && <RemoveAppModal
                app={removingApp}
                onCancel={() => {
                    if (container) {
                        container.hidden = false;
                    }

                    return setApplicationToRemove({});
                }}
                container={container}
            />}
            {options.map((option) => (!appIds.includes(option.value) ? (<Radio
                className="pf-u-mb-sm"
                key={option.value}
                onChange={() => onChange(option.value)}
                label={option.label}
                id={`${name}-${option.value}`}
                name={name}
                isChecked={value === option.value }
            />) : (<RemoveRadio
                key={option.value}
                option={option}
                setApplicationToRemove={setApplicationToRemove}
                sourceAppsNames={sourceAppsNames}
            />)))}
        </div>
    );
};

export default ApplicationSelect;
