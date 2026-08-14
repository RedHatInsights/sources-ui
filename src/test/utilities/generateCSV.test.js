import generateCSV from '../../utilities/generateCSV';
import applicationTypes from '../__mocks__/applicationTypes';
import { CSV_FILE } from '../__mocks__/fileMocks';
import { sourcesDataGraphQl } from '../__mocks__/sourcesData';
import sourceTypes from '../__mocks__/sourceTypes';

describe('generateCSV', () => {
  const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

  it('generates CSV file', () => {
    expect(generateCSV(sourcesDataGraphQl, INTL, applicationTypes, sourceTypes)).toEqual(CSV_FILE);
  });
});
