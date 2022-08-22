import React from 'react';
import { Card, CardBody, CardFooter, CardTitle, Skeleton } from '@patternfly/react-core';

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
