const computeSourceError = (source, intl) =>
  source.applications?.find(({ availability_status_error }) => availability_status_error)?.availability_status_error ||
  source.endpoint?.find(({ availability_status_error }) => availability_status_error)?.availability_status_error ||
  source.authentications?.find(({ availability_status_error }) => availability_status_error)?.availability_status_error ||
  intl.formatMessage({ id: 'wizard.unknownError', defaultMessage: 'Unknown error' });

export default computeSourceError;
