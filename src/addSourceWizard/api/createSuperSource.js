import { getSourcesApi } from '.';

const createSuperSource = async (formData, sourceTypes, timetoutedApps = []) => {
  console.log(formData);

  await getSourcesApi().bulkCreate({
    sources: [{ ...formData.source, source_type_name: formData.source_type }],
    authentications: [{ ...formData.authentication, resource_name: formData.source.name, resource_type: 'source' }],
    applications: formData.applications.map((appId) => ({
      application_type_id: appId,
      source_name: formData.source.name,
    })),
  });
};

export default createSuperSource;
