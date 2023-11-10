import { sourcesColumns } from '../views/sourcesViewDefinition';
import formatValueToExport from './formatValueToExport';

const generateCSV = (entities, intl, applicationTypes, sourceTypes) => {
  const columns = sourcesColumns(intl).filter(({ hidden }) => !hidden);

  const rows = [
    columns.map(({ title }) => title),
    ...entities.map((source) =>
      columns
        .map(({ value }) => formatValueToExport(value, source[value], applicationTypes, sourceTypes))
        .map((value) => (value?.includes(',') ? `"${value}"` : value)),
    ),
  ];

  return rows.map((r) => r.join(',')).join('\n');
};

export default generateCSV;
