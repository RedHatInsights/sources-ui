import React from 'react';
import { Button, Card, CardBody, CardFooter, CardTitle, Label } from '@patternfly/react-core';
import { DatabaseIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import ImageWithPlaceholder from '../components/TilesShared/ImageWithPlaceholder';

const MarketplaceCard = (product) => (
  <Card isFlat className="marketplace-card">
    <CardTitle className="pf-v5-u-pl-md pf-v5-u-pr-md">
      <ImageWithPlaceholder src={product.logo_url} className="marketplace-card-icon" />
      <br />
      {product.title}
      <br />
      <Label className="pf-v5-u-mt-sm marketplace-label" icon={<DatabaseIcon />}>
        {product.primary_category.display_name}
      </Label>
    </CardTitle>
    <CardBody className="marketplace-card-body pf-v5-u-mb-md pf-v5-u-pl-md pf-v5-u-pr-md" isFilled>
      {product.description_short}
    </CardBody>
    <CardFooter className="pf-v5-u-pl-md pf-v5-u-pr-md pf-v5-u-pb-md">
      <Button
        variant="link"
        isInline
        icon={<ExternalLinkAltIcon />}
        iconPosition="right"
        component="a"
        href={product.product_page_url}
        rel="noopener noreferrer"
        target="_blank"
      >
        Add{' '}
      </Button>
    </CardFooter>
  </Card>
);

export default MarketplaceCard;
