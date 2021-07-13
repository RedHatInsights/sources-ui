import generateCSV from '../../utilities/generateCSV';
import applicationTypesData from '../__mocks__/applicationTypesData';
import { CSV_FILE } from '../__mocks__/fileMocks';
import { sourcesDataGraphQl } from '../__mocks__/sourcesData';
import sourceTypesData from '../__mocks__/sourceTypesData';

describe('generateCSV', () => {
  const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

  it('generates CSV file', () => {
    expect(generateCSV(sourcesDataGraphQl, INTL, applicationTypesData.data, sourceTypesData.data)).toEqual(CSV_FILE);
  });
});
