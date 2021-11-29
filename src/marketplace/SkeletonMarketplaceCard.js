import React from 'react';
import { Card, CardTitle, CardBody, CardFooter, Skeleton } from '@patternfly/react-core';

const SkeletonMarketplaceCard = () => (
  <Card isFlat className="marketplace-card">
    <CardTitle>
      <Skeleton role="progressbar" />
    </CardTitle>
    <CardBody>
      <Skeleton role="progressbar" />
    </CardBody>
    <CardFooter>
      <Skeleton role="progressbar" />
    </CardFooter>
  </Card>
);

export default SkeletonMarketplaceCard;
