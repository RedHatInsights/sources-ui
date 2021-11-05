import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, Button } from '@patternfly/react-core';

import MarketplaceModal from './MarketplaceModal';

const SeeMoreCard = ({ data }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <React.Fragment>
      <MarketplaceModal onClose={() => setOpen(false)} data={data} isOpen={isOpen} />
      <Card isFlat className="marketplace-card marketplace-seemore-card">
        <CardBody isFilled className="pf-u-pl-md pf-u-pr-md card-text">
          Not what you’re looking for? Browse the catalog to see more offerings from Red Hat Marketplace.
        </CardBody>
        <CardFooter className="pf-u-pl-md pf-u-pr-md pf-u-pb-md">
          <Button variant="primary" onClick={() => setOpen(true)}>
            See more databases
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
