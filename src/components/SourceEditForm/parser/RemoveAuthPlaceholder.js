import React from 'react';

import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye';
import { Grid, GridItem } from '@patternfly/react-core/dist/js/layouts/Grid';

import { FormattedMessage } from 'react-intl';

import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';

const RemoveAuthPlaceholder = () => (
    <Grid>
        <GridItem xs={12}>
            <Bullseye>
                <Spinner size="lg"/>
            </Bullseye>
        </GridItem>
        <GridItem xs={12}>
            <Bullseye>
                <TextContent>
                    <Text component={TextVariants.small} className="pf-u-mt-md">
                        <FormattedMessage
                            id="sources.removingAuthMessage"
                            defaultMessage="This authentication is being removed..."
                        />
                    </Text>
                </TextContent>
            </Bullseye>
        </GridItem>
    </Grid>
);

export default RemoveAuthPlaceholder;
