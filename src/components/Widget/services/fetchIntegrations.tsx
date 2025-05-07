export interface Integration {
  type: string;
  sub_type?: string;
}

export const fetchIntegrations = async (): Promise<{
  counts: { [key: string]: number };
} | null> => {
  try {
    const response = await fetch('/api/integrations/v1.0/endpoints?type=ansible&type=webhook&type=camel&type=pagerduty');
    const { data } = await response.json();

    const validCamelSubTypes = ['teams', 'google_chat', 'slack', 'servicenow', 'splunk'];

    const counts: { [key: string]: number } = {
      ansible: 0,
      webhook: 0,
      pagerduty: 0,
      camel: 0,
      camel_google_chat: 0,
      camel_teams: 0,
      camel_slack: 0,
      camel_servicenow: 0,
      camel_splunk: 0,
    };

    counts.ansible = data.filter((integration: Integration) => integration.type === 'ansible').length;
    counts.webhook = data.filter((integration: Integration) => integration.type === 'webhook').length;
    counts.pagerduty = data.filter((integration: Integration) => integration.type === 'pagerduty').length;
    data.forEach((integration: Integration) => {
      if (integration.type === 'camel') {
        counts.camel++;
        if (integration.sub_type) {
          counts[integration.sub_type] = (counts[integration.sub_type] || 0) + 1;
        }
      }
    });

    const camelSubTypeCount = data.filter(
      (integration: Integration) => integration.type === 'camel' && validCamelSubTypes.includes(integration.sub_type ?? ''),
    ).length;
    counts.camel += camelSubTypeCount;

    return { counts };
  } catch (error) {
    console.error('Unable to get Integrations', error);
    return null;
  }
};
