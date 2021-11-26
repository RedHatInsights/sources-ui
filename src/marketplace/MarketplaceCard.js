import React from 'react';
import { Card, CardTitle, CardBody, CardFooter, Label, Button } from '@patternfly/react-core';
import { DatabaseIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import ImageWithPlaceholder from '../components/TilesShared/ImageWithPlaceholder';

const MarketplaceCard = (product) => (
  <Card isFlat className="marketplace-card">
    <CardTitle className="pf-u-pl-md pf-u-pr-md">
      <ImageWithPlaceholder src={product.publishedContent.logo.url} className="marketplace-card-icon" />
      <br />
      {product.publishedContent.title}
      <br />
      <Label className="pf-u-mt-sm marketplace-label" icon={<DatabaseIcon />}>
        {product.primaryCategory.content.name}
      </Label>
    </CardTitle>
    <CardBody className="marketplace-card-body pf-u-mb-md pf-u-pl-md pf-u-pr-md" isFilled>
      {product.publishedContent.localizedContent.descriptions.short}
    </CardBody>
    <CardFooter className="pf-u-pl-md pf-u-pr-md pf-u-pb-md">
      <Button
        variant="link"
        isInline
        icon={<ExternalLinkAltIcon />}
        iconPosition="right"
        component="a"
        href={`https://sandbox.marketplace.redhat.com/en-us/products/${product.productPageName}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Add{' '}
      </Button>
    </CardFooter>
  </Card>
);

export default MarketplaceCard;
