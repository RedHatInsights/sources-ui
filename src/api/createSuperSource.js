import { getSourcesApi } from './entities';
import { checkAppAvailability } from './getApplicationStatus';
import handleError from './handleError';

const createSuperSource = async (formData) => {
  try {
    const startDate = new Date();

    const sourceData = await getSourcesApi().bulkCreate({
      sources: [{ ...formData.source, source_type_name: formData.source_type }],
      authentications: [{ ...formData.authentication, resource_name: formData.source.name, resource_type: 'source' }],
      applications: formData.applications.map((appId) => ({
        application_type_id: appId,
        source_name: formData.source.name,
      })),
    });

    const authenticationDataOut = await checkAppAvailability(
      sourceData.authentications[0].id,
      undefined,
      undefined,
      'showAuthentication',
      startDate,
    );

    return {
      ...sourceData,
      ...sourceData.sources[0],
      authentications: [authenticationDataOut],
    };
  } catch (error) {
    const errorMessage = await handleError(error);
    throw errorMessage;
  }
};

export default createSuperSource;
