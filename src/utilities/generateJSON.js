import { sourcesColumns } from '../views/sourcesViewDefinition';
import formatValueToExport from './formatValueToExport';

const formatSource = (columns, source, applicationTypes, sourceTypes) =>
  columns.reduce(
    (acc, curr) => ({ ...acc, [curr.title]: formatValueToExport(curr.value, source[curr.value], applicationTypes, sourceTypes) }),
    {}
  );

const generateJSON = (entities, intl, applicationTypes, sourceTypes) => {
  const columns = sourcesColumns(intl).filter(({ hidden }) => !hidden);

  const rows = entities.map((source) => formatSource(columns, source, applicationTypes, sourceTypes));

  return JSON.stringify(rows, null, 2);
};

export default generateJSON;
