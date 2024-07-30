import React from 'react';
import PropTypes from 'prop-types';

const WebhooksIcon = ({ className }) => {
  const iconWebhook = '/apps/frontend-assets/integrations-landing/integrations-landing-webhook-icon.svg';
  return (
    <svg width="22" height="20" className={className}>
      <image xlinkHref={iconWebhook} width="22" height="20" />
    </svg>
  );
};

WebhooksIcon.propTypes = {
  className: PropTypes.string,
};

export default WebhooksIcon;
