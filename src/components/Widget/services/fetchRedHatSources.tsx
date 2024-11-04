export const fetchRedHatSources = async (): Promise<{
    counts: { [key: string]: number };
  } | null> => {
    try {
      const response = await fetch('/api/sources/v3.1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `{
            sources(limit: 50, offset: 0, sort_by: { name: "created_at", direction: desc }, filter: [
              { name: "source_type.category", operation: "eq", value: "Red Hat" }
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
          }`
        })
      });
  
      const { data } = await response.json();
  
      const counts: { [key: string]: number } = { 
        red_hat: 0,
        openshift: 0,
      };
  
      const redHatSourceTypes: Record<string, keyof typeof counts> = {
        '1': 'openshift',
      };
  
      counts.red_hat = data.meta.count;
  
      data.sources.forEach((source: { source_type_id: string }) => {
        const sourceKey = redHatSourceTypes[source.source_type_id];
        if (sourceKey) {
          counts[sourceKey]++;
        }
      });
    
      return { counts };
    } catch (error) {
      console.error('Unable to get Red Hat Sources', error);
      return null;
    }
  };
