import { defineMessages, useIntl } from 'react-intl';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardFooter } from '@patternfly/react-core';

import MarketplaceModal from './MarketplaceModal';

const messages = defineMessages({
  notWhatYouAreLookingFor: {
    id: 'marketplace.notWhatYouAreLookingFor',
    defaultMessage: 'Not what you\u2019re looking for? Browse the catalog to see more offerings from Red Hat Marketplace.',
  },
  seeMoreDatabases: {
    id: 'marketplace.seeMoreDatabases',
    defaultMessage: 'See more databases',
  },
});

const SeeMoreCard = ({ data }) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState(false);

  return (
    <React.Fragment>
      <MarketplaceModal onClose={() => setOpen(false)} data={data} isOpen={isOpen} />
      <Card className="marketplace-card marketplace-seemore-card">
        <CardBody isFilled className="pf-v6-u-pl-md pf-v6-u-pr-md card-text">
          {intl.formatMessage(messages.notWhatYouAreLookingFor)}
        </CardBody>
        <CardFooter className="pf-v6-u-pl-md pf-v6-u-pr-md pf-v6-u-pb-md">
          <Button variant="primary" onClick={() => setOpen(true)}>
            {intl.formatMessage(messages.seeMoreDatabases)}
          </Button>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
};

SeeMoreCard.propTypes = {
  data: PropTypes.array,
};

export default SeeMoreCard;
