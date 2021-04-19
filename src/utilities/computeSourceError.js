const computeSourceError = (source, intl) =>
  source.applications?.filter(Boolean).find(({ availability_status_error }) => availability_status_error)
    ?.availability_status_error ||
  source.endpoint?.filter(Boolean).find(({ availability_status_error }) => availability_status_error)
    ?.availability_status_error ||
  source.authentications?.filter(Boolean).find(({ availability_status_error }) => availability_status_error)
    ?.availability_status_error ||
  intl.formatMessage({ id: 'wizard.unknownError', defaultMessage: 'Unknown error' });

export default computeSourceError;
