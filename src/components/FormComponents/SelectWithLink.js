import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '@data-driven-forms/pf4-component-mapper';
import { useFieldApi } from '@data-driven-forms/react-form-renderer';
import { SelectVariant } from '@patternfly/react-core/deprecated';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const SelectWithLink = (originalProps) => {
  const { label, input, isDisabled, options, linkTitle, href } = useFieldApi(originalProps);

  return (
    <div>
      <div className="pf-v5-u-display-inline-block">
        <Select
          label={label}
          options={options}
          {...input}
          disabled={isDisabled}
          variant={SelectVariant.single}
          aria-label={label}
        />
      </div>
      <Button
        icon={<ExternalLinkAltIcon />}
        component="a"
        variant={ButtonVariant.link}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkTitle}
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
  linkTitle: 'Learn more',
};

export default SelectWithLink;
