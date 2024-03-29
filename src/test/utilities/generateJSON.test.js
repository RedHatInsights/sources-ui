import generateJSON from '../../utilities/generateJSON';
import applicationTypes from '../__mocks__/applicationTypes';
import { JSON_FILE } from '../__mocks__/fileMocks';
import { sourcesDataGraphQl } from '../__mocks__/sourcesData';
import sourceTypes from '../__mocks__/sourceTypes';

describe('generateCSV', () => {
  const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

  it('generates CSV file', () => {
    expect(JSON.parse(generateJSON(sourcesDataGraphQl, INTL, applicationTypes, sourceTypes))).toEqual(JSON_FILE);
  });
});
