import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
    TextContent,
    TextList,
    TextListVariants,
    TextListItem,
    TextListItemVariants
} from '@patternfly/react-core';

const Summary = ({ formOptions, sourceTypes, appTypes, source }) => {
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
    }),
    sourceTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired
    })),
    appTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired
    })),
    source: PropTypes.shape({
        name: PropTypes.string.isRequired,
        source_type_id: PropTypes.string.isRequired,
        application_type_id: PropTypes.number
    })
};

const mapStateToProps = ({ providers: { entities, appTypes, sourceTypes } }, { match: { params: { id } } }) =>
    ({ source: entities.find(source => source.id  === id), appTypes, sourceTypes });

export default withRouter(connect(mapStateToProps)(Summary));
