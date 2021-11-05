import React from 'react';
import { Card, CardTitle, CardBody, CardFooter, Skeleton } from '@patternfly/react-core';

const SkeletonMarketplaceCard = () => (
  <Card isFlat className="marketplace-card">
    <CardTitle>
      <Skeleton />
    </CardTitle>
    <CardBody>
      <Skeleton />
    </CardBody>
    <CardFooter>
      <Skeleton />
    </CardFooter>
  </Card>
);

export default SkeletonMarketplaceCard;
