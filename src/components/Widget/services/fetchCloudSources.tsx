export const fetchCloudSources = async (): Promise<{
  counts: { [key: string]: number };
} | null> => {
  try {
    const response = await fetch('/api/sources/v3.1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `{
            sources(limit: 50, offset: 0, sort_by: { name: "created_at", direction: desc }, filter: [
              { name: "source_type.category", operation: "eq", value: "Cloud" }
            ]) {
              id
              created_at
              name
              source_type_id
              availability_status
            }
            meta {
              count
            }
          }`,
      }),
    });

    const { data } = await response.json();

    const counts: { [key: string]: number } = {
      cloud: 0,
      aws: 0,
      google_cloud: 0,
      azure: 0,
    };

    const cloudProviderIds: Record<string, keyof typeof counts> = {
      '1': 'aws',
      '2': 'google_cloud',
      '3': 'azure',
    };

    counts.cloud = data.meta.count;

    data.sources.forEach((source: { source_type_id: string }) => {
      const providerKey = cloudProviderIds[source.source_type_id];
      if (providerKey) {
        counts[providerKey]++;
      }
    });

    return { counts };
  } catch (error) {
    console.error('Unable to get Cloud Sources', error);
    return null;
  }
};
