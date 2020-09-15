import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Grid, GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/index';

import RemoveAppModal from './RemoveAppModal';
import ApplicationList from '../ApplicationsList/ApplicationList';
import { useSource } from '../../hooks/useSource';

const AddApplicationDescription = ({ container }) => {
    const [removingApp, setApplicationToRemove] = useState({});
    const intl = useIntl();

    const sourceTypes = useSelector(({ sources }) => sources.sourceTypes);
    const source = useSource();

    const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
    const apps = source.applications.filter((app) => !app.isDeleting);

    return (
        <React.Fragment>
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
            <TextContent>
                <Grid hasGutter>
                    <GridItem md={2}>
                        <Text component={TextVariants.h4}>
                            { intl.formatMessage({
                                id: 'sources.sourceName',
                                defaultMessage: 'Source name'
                            }) }
                        </Text>
                        <Text component={TextVariants.p} id="add-application-desc-name">
                            {source.name}
                        </Text>
                    </GridItem>
                    <GridItem md={2}>
                        <Text component={TextVariants.h4}>
                            { intl.formatMessage({
                                id: 'sources.type',
                                defaultMessage: 'Type'
                            }) }
                        </Text>
                        <Text component={TextVariants.p} id="add-application-desc-type">
                            { sourceType ? sourceType.product_name : intl.formatMessage({
                                id: 'sources.typeNotFound',
                                defaultMessage: 'Type not found'
                            })}
                        </Text>
                    </GridItem>
                    <GridItem md={8}>
                        <Text component={TextVariants.h4}>
                            { intl.formatMessage({
                                id: 'sources.apps',
                                defaultMessage: 'Applications'
                            }) }
                        </Text>
                        {apps.length > 0 ? <ApplicationList setApplicationToRemove={setApplicationToRemove}/>
                            : (
                                <Text component={TextVariants.p} id="add-application-desc-no-app">
                                    {intl.formatMessage({
                                        id: 'sources.noApps',
                                        defaultMessage: 'No applications'
                                    })}
                                </Text>
                            )
                        }
                    </GridItem>
                </Grid>
            </TextContent>
        </React.Fragment>
    );
};

AddApplicationDescription.propTypes = {
    container: PropTypes.instanceOf(Element)
};

export default AddApplicationDescription;
