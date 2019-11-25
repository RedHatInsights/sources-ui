import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
    TextContent,
    TextList,
    TextListVariants,
    TextListItem,
    TextListItemVariants
} from '@patternfly/react-core';

import RedirectNoId from '../RedirectNoId/RedirectNoId';
import { useSource } from '../../hooks/useSource';

const Summary = ({ formOptions }) => {
    const { id } = useParams();
    const { sourceTypes, appTypes } = useSelector(({ providers }) => providers, shallowEqual);
    const source = useSource(id);

    if (!source) {
        return <RedirectNoId />;
    }

    const type = sourceTypes.find((sourceType) => sourceType.id === source.source_type_id);
    const applicationId = formOptions.getState().values.application;
    const application = appTypes.find((app) => app.id === applicationId);

    return (
        <TextContent>
            <TextList component={ TextListVariants.dl }>
                <TextListItem component={ TextListItemVariants.dt }>
                    <FormattedMessage
                        id="sources.name"
                        defaultMessage="Name"
                    />
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>{ source.name }</TextListItem>
                {type && <React.Fragment>
                    <TextListItem component={ TextListItemVariants.dt }>
                        <FormattedMessage
                            id="sources.sourceType"
                            defaultMessage="Source type"
                        />
                    </TextListItem>
                    <TextListItem component={ TextListItemVariants.dd }>{ type.product_name }</TextListItem>
                </React.Fragment>
                }
                <TextListItem component={ TextListItemVariants.dt }>
                    <FormattedMessage
                        id="sources.app"
                        defaultMessage="Application"
                    />
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>{ application.display_name }</TextListItem>
            </TextList>
        </TextContent>
    );
};

Summary.propTypes = {
    formOptions: PropTypes.shape({
        getState: PropTypes.func.isRequired
    })
};

export default Summary;
