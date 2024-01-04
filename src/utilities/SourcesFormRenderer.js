import React from 'react';
import PropTypes from 'prop-types';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import pf4ComponentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';

import Authentication from '../components/Authentication';

import SourceWizardSummary from '../components/FormComponents/SourceWizardSummary';
import Description from '../components/FormComponents/Description';
import CardSelect from '../components/FormComponents/CardSelect';
import AuthSelect from '../components/FormComponents/AuthSelect';
import EnhancedRadio from '../components/FormComponents/EnhancedRadio';
import SwitchGroup from '../components/FormComponents/SwitchGroup';
import CheckboxWithIcon from '../components/FormComponents/CheckboxWithIcon';
import PFDivider from '../components/FormComponents/PFDivider';
import RhelUsageCheckbox from '../components/FormComponents/RhelUsageCheckbox';
import CheckboxWithLink from '../components/FormComponents/CheckboxWithLink';

export const mapperExtension = {
  'auth-select': AuthSelect,
  description: Description,
  'card-select': CardSelect,
  summary: SourceWizardSummary,
  'enhanced-radio': EnhancedRadio,
  'switch-group': SwitchGroup,
  authentication: Authentication,
  'checkbox-with-icon': CheckboxWithIcon,
  divider: PFDivider,
  'rhel-usage-checkbox': RhelUsageCheckbox,
  'checkbox-with-link': CheckboxWithLink,
};

const SourcesFormRenderer = ({ componentMapper, ...props }) => (
  <FormRenderer
    FormTemplate={FormTemplate}
    componentMapper={{
      ...pf4ComponentMapper,
      ...mapperExtension,
      ...componentMapper,
    }}
    {...props}
  />
);

SourcesFormRenderer.propTypes = {
  componentMapper: PropTypes.object,
};

export default SourcesFormRenderer;
