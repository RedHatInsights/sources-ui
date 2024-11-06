import React from "react";
import { COMMUNICATIONS, REPORTING, WEBHOOKS, CLOUD_VENDOR, REDHAT_VENDOR } from "../../../utilities/constants";
import ImageWithPlaceholder from "../../TilesShared/ImageWithPlaceholder";

export const integrationsData = [
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
            <ImageWithPlaceholder className="slack-logo" src="/apps/frontend-assets/sources-integrations/slack.svg" alt="slack" />
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
    {
      title: CLOUD_VENDOR,
      items: [
        {
          name: 'Amazon Web Services',
          id: 'aws',
          value: CLOUD_VENDOR,
          icon: <ImageWithPlaceholder className="aws-logo" src="/apps/frontend-assets/partners-icons/aws.svg" alt="aws logo" />,
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
        {
          name: 'Oracle Cloud Infrastructure',
          id: 'oracle_cloud',
          value: CLOUD_VENDOR,
          icon: (
            <ImageWithPlaceholder
              className="oracle-logo"
              src="/apps/frontend-assets/partners-icons/oracle-short.svg"
              alt="oracle logo"
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
              src="/apps/frontend-assets/red-hat-logos/stacked.svg"
              alt="red hat logo"
            />
          ),
        },
      ],
    },
  ];
  