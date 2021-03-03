import { getSourcesApi } from '.';
import checkSourceStatus from '../../api/checkSourceStatus';
import { checkAppAvailability } from './getApplicationStatus';
import handleError from './handleError';

const createSuperSource = async (formData, _sourceTypes, _timetoutedApps) => {
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

    await checkSourceStatus(sourceData.sources[0].id);

    const checkStatusPromises = [];

    checkStatusPromises.push(
      checkAppAvailability(sourceData.authentications[0].id, undefined, undefined, 'getAuthentication', startDate)
    );

    sourceData.applications.forEach(({ id }) =>
      checkStatusPromises.push(checkAppAvailability(id, undefined, undefined, 'getApplication', startDate))
    );

    const [authenticationDataOut, ...applications] = await Promise.all(checkStatusPromises);

    return {
      ...sourceData,
      ...sourceData.sources[0],
      authentications: [authenticationDataOut],
      applications,
    };
  } catch (error) {
    const errorMessage = await handleError(error);
    throw errorMessage;
  }
};

export default createSuperSource;
