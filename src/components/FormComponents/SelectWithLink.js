import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '@data-driven-forms/pf4-component-mapper';
import { useFieldApi } from '@data-driven-forms/react-form-renderer';
import { SelectVariant } from '@patternfly/react-core/deprecated';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useIntl } from 'react-intl';

const SelectWithLink = (originalProps) => {
  const { label, input, isDisabled, options, linkTitle, href } = useFieldApi(originalProps);

  const intl = useIntl();
  const linkTitleIntl =
    linkTitle ||
    intl.formatMessage({
      id: 'sources.selectWithLink.learnMore',
      defaultMessage: 'Learn more',
    });

  return (
    <div>
      <Select
        FormGroupProps={{
          className: 'pf-v5-u-display-inline-block',
        }}
        label={label}
        options={options}
        {...input}
        disabled={isDisabled}
        variant={SelectVariant.single}
      />
      <Button
        icon={<ExternalLinkAltIcon />}
        component="a"
        variant={ButtonVariant.link}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkTitleIntl}
      </Button>
    </div>
  );
};

SelectWithLink.propTypes = {
  isDisabled: PropTypes.bool,
  options: PropTypes.array,
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  linkTitle: PropTypes.string,
};

SelectWithLink.defaultProps = {
  isDisabled: false,
  options: [],
};

export default SelectWithLink;
