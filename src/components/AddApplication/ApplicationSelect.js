import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { Radio } from '@patternfly/react-core/dist/js/components/Radio/Radio';
import { Button } from '@patternfly/react-core/dist/js/components/Button';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';

import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';

import { useSource } from '../../hooks/useSource';

import RemoveAppModal from './RemoveAppModal';

const RemoveRadio = ({ option, setApplicationToRemove, sourceAppsNames, app, appType }) => {
    const onClick = () => setApplicationToRemove({
        id: app?.id,
        display_name: appType?.display_name,
        dependent_applications: appType?.dependent_applications,
        sourceAppsNames
    });

    return (<div className="pf-c-radio pf-u-mb-md">
        <Button
            id={`remove-app-${option.value}`}
            variant="plain"
            aria-label="Remove app"
            className="pf-u-p-0"
            onClick={onClick}
        >
            <TrashIcon variant="small" />
        </Button>
        <label className="pf-c-radio__label" htmlFor={`remove-app-${option.value}`}>
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
    sourceAppsNames: PropTypes.arrayOf(PropTypes.string),
    appType: PropTypes.shape({
        display_name: PropTypes.string.isRequired,
        dependent_applications: PropTypes.arrayOf(PropTypes.string)
    }),
    app: PropTypes.shape({
        id: PropTypes.string.isRequired,
        application_type_id: PropTypes.string.isRequired
    })
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

    const appType = (value) => appTypes?.find(appType =>
        appType.id === value
    );
    const app = (value) => source.applications.find(app => app.application_type_id === value);

    const isCurrentlyRemoving = (value) => app(value)?.isDeleting;

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
                className="pf-u-mb-md"
                key={option.value}
                onChange={() => onChange(option.value)}
                label={option.label}
                id={`${name}-${option.value}`}
                name={name}
                isChecked={value === option.value }
                isDisabled={isCurrentlyRemoving(option.value)}
            />) : (<RemoveRadio
                key={option.value}
                option={option}
                setApplicationToRemove={setApplicationToRemove}
                sourceAppsNames={sourceAppsNames}
                app={app(option.value)}
                appType={appType(option.value)}
            />)))}
        </div>
    );
};

export default ApplicationSelect;
