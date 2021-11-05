import React, { useEffect, useState } from 'react';
import { Title } from '@patternfly/react-core';

import './marketplace.scss';

import MarketplaceCard from './MarketplaceCard';
import { getProducts } from './api';
import SeeMoreCard from './SeeMoreCard';
import SkeletonMarketplaceCard from './SkeletonMarketplaceCard';

const RecommendedServices = () => {
  const [data, setData] = useState();

  useEffect(() => {
    getProducts().then((res) => setData(res?.data?.productByIds?.products));
  }, []);

  if (data) {
    return (
      <React.Fragment>
        <Title headingLevel="h4" size="xl" className="pf-u-mb-md">
          Recommended services
        </Title>
        <div className="pf-u-mb-md marketplace-flex">
          <MarketplaceCard
            {...(data.find((product) => product?.productPageName?.[0] === 'mongodb-enterprise-advanced') || data[0])}
          />
          <SeeMoreCard data={data} />
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="pf-u-mb-md marketplace-flex">
      <SkeletonMarketplaceCard />
      <SkeletonMarketplaceCard />
    </div>
  );
};

export default RecommendedServices;
