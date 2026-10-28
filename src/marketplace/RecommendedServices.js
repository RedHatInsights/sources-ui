import { defineMessages, useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';
import { Title } from '@patternfly/react-core';

import './marketplace.scss';

import MarketplaceCard from './MarketplaceCard';
import { getProducts } from './api';
import SeeMoreCard from './SeeMoreCard';
import SkeletonMarketplaceCard from './SkeletonMarketplaceCard';

const messages = defineMessages({
  recommendedServices: {
    id: 'marketplace.recommendedServices',
    defaultMessage: 'Recommended services',
  },
});

const RecommendedServices = () => {
  const intl = useIntl();
  const [data, setData] = useState();

  useEffect(() => {
    getProducts().then(({ data }) => setData(data));
  }, []);

  if (data) {
    return (
      <div className="sources">
        <Title headingLevel="h4" size="xl" className="pf-v6-u-mb-md">
          {intl.formatMessage(messages.recommendedServices)}
        </Title>
        <div className="pf-v6-u-mb-md marketplace-flex">
          <MarketplaceCard
            {...(data.find((product) => product?.product_page_name === 'mongodb-enterprise-advanced') || data[0])}
          />
          <SeeMoreCard data={data} />
        </div>
      </div>
    );
  }

  return (
    <div className="pf-v6-u-mb-md marketplace-flex">
      <SkeletonMarketplaceCard />
      <SkeletonMarketplaceCard />
    </div>
  );
};

export default RecommendedServices;
