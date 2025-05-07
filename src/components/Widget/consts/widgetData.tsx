import React from 'react';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../../utilities/constants';
import ImageWithPlaceholder from '../../TilesShared/ImageWithPlaceholder';

type IntegrationItem = {
  name: string;
  id: string;
  value: string;
  icon: React.JSX.Element;
};

type IntegrationCategory = {
  title: string;
  items: IntegrationItem[];
};

export const createIntegrationsData = (
  isPagerDutyEnabled: boolean,
  hasSourcesPermissions: boolean,
  hasIntegrationsPermissions: boolean,
): IntegrationCategory[] => [
  ...(hasIntegrationsPermissions
    ? [
        {
          title: COMMUNICATIONS,
          items: [
            {
              name: 'Google Chat',
              id: 'google_chat',
              value: COMMUNICATIONS,
              icon: (
                <ImageWithPlaceholder
                  className="google-chat-logo"
                  src="/apps/frontend-assets/sources-integrations/google-chat.svg"
                  alt="google chat"
                />
              ),
            },
            {
              name: 'Microsoft Office Teams',
              id: 'teams',
              value: COMMUNICATIONS,
              icon: (
                <ImageWithPlaceholder
                  className="microsoft-teams-logo"
                  src="/apps/frontend-assets/sources-integrations/microsoft-office-teams.svg"
                  alt="microsoft teams"
                />
              ),
            },
            {
              name: 'Slack',
              id: 'slack',
              value: COMMUNICATIONS,
              icon: (
                <ImageWithPlaceholder
                  className="slack-logo"
                  src="/apps/frontend-assets/sources-integrations/slack.svg"
                  alt="slack"
                />
              ),
            },
          ],
        },
        {
          title: REPORTING,
          items: [
            {
              name: 'Event-Driven Ansible',
              id: 'ansible',
              value: REPORTING,
              icon: (
                <ImageWithPlaceholder
                  className="ansible-logo"
                  src="/apps/frontend-assets/sources-integrations/ansible.svg"
                  alt="ansible"
                />
              ),
            },
            ...(isPagerDutyEnabled
              ? [
                  {
                    name: 'PagerDuty',
                    id: 'pagerduty',
                    value: REPORTING,
                    icon: (
                      <ImageWithPlaceholder
                        className="pagerduty-logo"
                        src="/apps/frontend-assets/sources-integrations/pagerduty-widget.svg"
                        alt="pagerduty"
                      />
                    ),
                  },
                ]
              : []),
            {
              name: 'ServiceNow',
              id: 'servicenow',
              value: REPORTING,
              icon: (
                <ImageWithPlaceholder
                  className="service-now-logo"
                  src="/apps/frontend-assets/sources-integrations/service-now.svg"
                  alt="service"
                />
              ),
            },
            {
              name: 'Splunk',
              id: 'splunk',
              value: REPORTING,
              icon: (
                <ImageWithPlaceholder
                  className="splunk-logo"
                  src="/apps/frontend-assets/sources-integrations/splunk.svg"
                  alt="splunk"
                />
              ),
            },
          ],
        },
        {
          title: WEBHOOKS,
          items: [
            {
              name: 'Webhooks',
              id: 'webhook',
              value: WEBHOOKS,
              icon: (
                <ImageWithPlaceholder
                  className="webhook-logo"
                  src="/apps/frontend-assets/integrations-landing/integrations-landing-webhook-icon.svg"
                  alt="webhooks"
                />
              ),
            },
          ],
        },
      ]
    : []),
  ...(hasSourcesPermissions
    ? [
        {
          title: CLOUD_VENDOR,
          items: [
            {
              name: 'Amazon Web Services',
              id: 'aws',
              value: CLOUD_VENDOR,
              icon: (
                <ImageWithPlaceholder className="aws-logo" src="/apps/frontend-assets/partners-icons/aws.svg" alt="aws logo" />
              ),
            },
            {
              name: 'Google Cloud',
              id: 'google_cloud',
              value: CLOUD_VENDOR,
              icon: (
                <ImageWithPlaceholder
                  className="google-logo"
                  src="/apps/frontend-assets/partners-icons/google-cloud-short.svg"
                  alt="google logo"
                />
              ),
            },
            {
              name: 'Microsoft Azure',
              id: 'azure',
              value: CLOUD_VENDOR,
              icon: (
                <ImageWithPlaceholder
                  className="azure-logo"
                  src="/apps/frontend-assets/partners-icons/microsoft-azure-short.svg"
                  alt="azure logo"
                />
              ),
            },
          ],
        },
        {
          title: REDHAT_VENDOR,
          items: [
            {
              name: 'OpenShift Container Platform',
              id: 'openshift',
              value: REDHAT_VENDOR,
              icon: (
                <ImageWithPlaceholder
                  className="redhat-icon"
                  src="/apps/frontend-assets/platform-logos/openshift.svg"
                  alt="red hat logo"
                />
              ),
            },
          ],
        },
      ]
    : []),
];