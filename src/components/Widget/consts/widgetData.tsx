import React from 'react';
import EnvelopeIcon from '@patternfly/react-icons/dist/dynamic/icons/envelope-icon';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../../utilities/constants';
import ImageWithPlaceholder from '../../TilesShared/ImageWithPlaceholder';

export type IntegrationItem = {
  name: string;
  id: string;
  value: string;
  icon: React.JSX.Element;
};

export type IntegrationCategory = {
  title: string;
  items: IntegrationItem[];
  value: string;
};

export const createIntegrationsData = (
  isPagerDutyEnabled: boolean,
  hasSourcesPermissions: boolean,
  hasIntegrationsPermissions: boolean,
  isEmailEnabled: boolean,
): IntegrationCategory[] => [
  ...(hasIntegrationsPermissions
    ? [
        {
          title: COMMUNICATIONS,
          value: COMMUNICATIONS,
          items: [
            {
              name: 'Google Chat',
              id: 'google_chat',
              value: COMMUNICATIONS,
              icon: (
                <ImageWithPlaceholder
                  className="google-chat-logo"
                  src="/apps/frontend-assets/partners-icons/google-chat.svg"
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
                  src="/apps/frontend-assets/partners-icons/microsoft-office-teams.svg"
                  alt="microsoft teams"
                />
              ),
            },
            {
              name: 'Slack',
              id: 'slack',
              value: COMMUNICATIONS,
              icon: (
                <ImageWithPlaceholder className="slack-logo" src="/apps/frontend-assets/partners-icons/slack.svg" alt="slack" />
              ),
            },
            ...(isEmailEnabled
              ? [
                  {
                    name: 'Email',
                    id: 'email',
                    value: COMMUNICATIONS,
                    icon: <EnvelopeIcon />,
                  },
                ]
              : []),
          ],
        },
        {
          title: 'Reporting & automation',
          value: REPORTING,
          items: [
            {
              name: 'Event-Driven Ansible',
              id: 'ansible',
              value: REPORTING,
              icon: (
                <ImageWithPlaceholder
                  className="ansible-logo"
                  src="/apps/frontend-assets/technology-icons/ansible.svg"
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
                        src="/apps/frontend-assets/partners-icons/pagerduty-short.svg"
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
                  src="/apps/frontend-assets/partners-icons/service-now-logomark.svg"
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
                  src="/apps/frontend-assets/partners-icons/splunk-logomark.svg"
                  alt="splunk"
                />
              ),
            },
          ],
        },
        {
          title: WEBHOOKS,
          value: WEBHOOKS,
          items: [
            {
              name: 'Webhooks',
              id: 'webhook',
              value: WEBHOOKS,
              icon: (
                <ImageWithPlaceholder
                  className="webhook-logo"
                  src="/apps/frontend-assets/technology-icons/webhook-integrations-1.svg"
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
          value: CLOUD_VENDOR,
          items: [
            {
              name: 'Amazon Web Services',
              id: 'aws',
              value: CLOUD_VENDOR,
              icon: (
                <ImageWithPlaceholder
                  className="aws-logo"
                  src="/apps/frontend-assets/partners-icons/aws-logomark.svg"
                  alt="aws logo"
                />
              ),
            },
            {
              name: 'Google Cloud',
              id: 'google_cloud',
              value: CLOUD_VENDOR,
              icon: (
                <ImageWithPlaceholder
                  className="google-logo"
                  src="/apps/frontend-assets/partners-icons/google-cloud-logomark.svg"
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
                  src="/apps/frontend-assets/partners-icons/microsoft-azure-logomark.svg"
                  alt="azure logo"
                />
              ),
            },
          ],
        },
        {
          title: REDHAT_VENDOR,
          value: REDHAT_VENDOR,
          items: [
            {
              name: 'OpenShift Container Platform',
              id: 'openshift',
              value: REDHAT_VENDOR,
              icon: (
                <ImageWithPlaceholder
                  className="redhat-icon"
                  src="/apps/frontend-assets/technology-icons/openshift.svg"
                  alt="red hat logo"
                />
              ),
            },
          ],
        },
      ]
    : []),
];
