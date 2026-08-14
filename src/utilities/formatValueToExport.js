const formatValueToExport = (key, value, applicationTypes, sourceTypes) => {
  switch (key) {
    case 'applications':
      return value
        .map(({ application_type_id }) => applicationTypes.find(({ id }) => id === application_type_id)?.display_name)
        .join(',');
    case 'source_type_id':
      return sourceTypes.find(({ id }) => id === value)?.product_name;
    default:
      return value;
  }
};

export default formatValueToExport;
